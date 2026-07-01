// netlify/functions/manage-account.js
//
// Permet au Super Admin de modifier (nom/e-mail) ou supprimer un compte
// (typiquement le contact administratif d'une école). Utilise la clé
// service_role, jamais exposée au navigateur.

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Méthode non autorisée' };
  }

  try {
    const { action, userId, email, full_name, requesterToken } = JSON.parse(event.body || '{}');

    if (!action || !userId || !requesterToken) {
      return { statusCode: 400, body: 'Champs manquants' };
    }

    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: requesterData, error: authError } = await supabaseAdmin.auth.getUser(requesterToken);
    if (authError || !requesterData?.user) {
      return { statusCode: 401, body: 'Non authentifié' };
    }

    const { data: requesterProfile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', requesterData.user.id)
      .single();

    if (requesterProfile?.role !== 'super_admin') {
      return { statusCode: 403, body: 'Action réservée au Super Admin' };
    }

    if (action === 'update') {
      if (email) {
        const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(userId, { email });
        if (updErr) return { statusCode: 400, body: updErr.message };
      }
      const profileUpdates = {};
      if (full_name !== undefined) profileUpdates.full_name = full_name;
      if (email) profileUpdates.email = email;
      if (Object.keys(profileUpdates).length) {
        await supabaseAdmin.from('profiles').update(profileUpdates).eq('id', userId);
      }
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    if (action === 'delete') {
      await supabaseAdmin.from('profiles').delete().eq('id', userId);
      const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (delErr) return { statusCode: 400, body: delErr.message };
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 400, body: 'Action inconnue' };
  } catch (e) {
    return { statusCode: 500, body: 'Erreur serveur : ' + e.message };
  }
};
