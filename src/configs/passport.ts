import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { dataSource } from './dbConfig';
import User from '../entity/user.entity';

const JWT_SECRET = 'Nc$ykT*lUW3567^$@&iC1tpR$H$b29HJ'; // Same secret used for token creation

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    try {
      const userRepository = dataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: jwtPayload.userId } });

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);
