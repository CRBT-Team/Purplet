import { User } from './src';

const user = await User.fetch('userId');
const channel1 = await user.createDM();

const channel2 = await User.createDM('12345');
