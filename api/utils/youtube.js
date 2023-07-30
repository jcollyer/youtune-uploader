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
  youtube,
  videoQue,
  files,
  title,
  description,
  scheduleDate,
  categoryId,
  tags,
) => {
  if (videoQue === 0) {
    console.log('return 200');
    process.exit(0);
  } else {
    videoQue--;
    console.log('---------sendToYT--->', {
      videoQue,
      files,
      description: Array.isArray(description)
        ? description[videoQue]
        : description,
      title: Array.isArray(title) ? title[videoQue] : title,
      scheduleDate: Array.isArray(scheduleDate)
        ? new Date(scheduleDate[videoQue])?.toISOString()
        : new Date(scheduleDate)?.toISOString(),
      categoryId: Array.isArray(categoryId) ? categoryId[videoQue] : categoryId,
      tags: Array.isArray(tags) ? tags[videoQue] : tags,
    });

    youtube.videos.insert(
      {
        part: 'id,snippet,status',
        notifySubscribers: false,
        requestBody: {
          snippet: {
            title: Array.isArray(title) ? title[videoQue] : title,
            description: Array.isArray(description)
              ? description[videoQue]
              : description,
            categoryId: Array.isArray(categoryId)
              ? categoryId[videoQue]
              : categoryId,
            tags: Array.isArray(tags) ? tags[videoQue] : tags,
          },
          status: {
            privacyStatus: 'private',
            publishAt: Array.isArray(scheduleDate)
              ? new Date(scheduleDate[videoQue]).toISOString()
              : new Date(scheduleDate).toISOString(),
          },
        },
        media: {
          body: fs.createReadStream(`/tmp/${files[videoQue].filename}`),
        },
      },
      (err, data) => {
        console.log(err, data);
        console.log('Done');
        sendToYT(
          youtube,
          videoQue,
          files,
          title,
          description,
          scheduleDate,
          categoryId,
          tags,
        );
      },
    );
  }
};

module.exports = { sendToYT, uploadVideoFile, storage };
