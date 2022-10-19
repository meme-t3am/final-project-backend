// const UserImage = require('./lib/models/UserImage');
// const UserTag = require('./lib/models/UserTag');
// const {  imaggaAPI, mungeData } = require('./APIServices');

// async function addUserImages(url, user_id) {
//   const results = await imaggaAPI(url.url);
//   const tags = mungeData(results);
//   const image = await UserImage.insert(url.url, user_id);
//   const imagePromises = tags.map((tag) =>
//     UserTag.insertTag(tag.tag, image.id, tag.confidence)
//   );
//   await Promise.all(imagePromises);
//   const newObj = {
//     url,
//     tags,
//   };
//   return newObj;
// }

// module.exports = {
//   addUserImages,
// };
