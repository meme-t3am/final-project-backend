import { imaggaAPI, mungeData } from './APIServices';
import UserImage from './lib/models/UserImage';

async function addUserImages(userImage) {
  const results = await imaggaAPI(userImage);
  const tags = mungeData(results);
  const image = await UserImage.insert(userImage);
}

module.exports = {
  addUserImages,
};
