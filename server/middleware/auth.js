const supabase = require('../config/supabase');

/**
 * Express middleware to verify Supabase Auth JWT tokens.
 * This ensures the request is coming from an authenticated admin.
 */
const requireAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the JWT token using Supabase client
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Attach the user to the request object for downstream use
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth verification error:', err);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

module.exports = {
  requireAdmin
};
