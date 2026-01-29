import allowedOrigins from '../config/allowedOrgins.js';

const corsOptions = {

  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) { //only the allowed origin will provide service 
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));  //if not allowed origin the callback function exicute the cors error
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

export default corsOptions;



