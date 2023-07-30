const uuid = require('uuid').v4;
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp');
  },
  filename(req, file, cb) {
    console.log('------storage------>', file);
    const newFilename = `${uuid()}-${file.originalname}`;
    cb(null, newFilename);
  },
});

const uploadVideoFile = multer({
  storage,
}).array('file');

const sendToYT = (
  res,
  youtube,
  videoQue,
  files,
  title,
  description,
  scheduleDate,
  categoryId,
  tags,
) => {
  let index = -1;
  if (videoQue === 0) {
    console.log('return 200');
    res.status(200).send('ok');
  } else {
    index++;
    videoQue--;
    console.log('---------sendToYT--->', {
      videoQue,
      files,
      index,
      description: Array.isArray(description)
        ? description[index]
        : description,
      title: Array.isArray(title) ? title[index] : title,
      scheduleDate: Array.isArray(scheduleDate)
        ? new Date(scheduleDate[index])?.toISOString() || new Date().toISOString()
        : new Date(scheduleDate)?.toISOString() || new Date().toISOString(),
      categoryId: Array.isArray(categoryId) ? categoryId[index] || 1 : categoryId || 1,
      tags: Array.isArray(tags) ? tags[index] : tags,
    });

    // youtube.videos.insert(
    //   {
    //     part: 'id,snippet,status',
    //     notifySubscribers: false,
    //     requestBody: {
    //       snippet: {
    //         title: Array.isArray(title) ? title[index] : title,
    //         description: Array.isArray(description)
    //           ? description[index] || ''
    //           : description || '',
    //         categoryId: Array.isArray(categoryId)
    //           ? categoryId[index] || 1
    //           : categoryId || 1,
    //         tags: Array.isArray(tags) ? tags[index] : tags,
    //       },
    //       status: {
    //         privacyStatus: 'private',
    //         // publishAt: Array.isArray(scheduleDate)
    //         //   ? new Date(scheduleDate[index]).toISOString()
    //         //   : new Date(scheduleDate).toISOString(),
    //       },
    //     },
    //     media: {
    //       body: fs.createReadStream(`/tmp/${files[index].filename}`),
    //     },
    //   },
    //   (err, data) => {
    //     console.log(err, data);
    //     console.log('Done');
    //     sendToYT(
    //       res,
    //       youtube,
    //       videoQue,
    //       files,
    //       title,
    //       description,
    //       scheduleDate,
    //       categoryId,
    //       tags,
    //     );
    //   },
    // );
  }
};

module.exports = { sendToYT, uploadVideoFile, storage };
