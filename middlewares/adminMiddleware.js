import jwt from 'jsonwebtoken';

const adminMiddleware = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header provided' });
    }

 
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Invalid authorization format' });
    }

  
    const token = authHeader.split(' ')[1];

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
    req.adminid = decoded.adminid;
    console.log(req.adminid)

    next();
  } catch (error) {
    console.log(error.name,"error in token");
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default adminMiddleware;