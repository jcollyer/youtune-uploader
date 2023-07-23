const uuid = require('uuid').v4;
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: './tmp',
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
    let index = -1;
    if (videoQue === 0) {
      process.exit();
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
        // scheduleDate: Array.isArray(scheduleDate)
        //   ? new Date(scheduleDate[index])?.toISOString()
        //   : new Date(scheduleDate)?.toISOString(),
        categoryId: Array.isArray(categoryId) ? categoryId[index] : categoryId,
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
      //           ? description[index]
      //           : description,
      //         categoryId: Array.isArray(categoryId)
      //           ? categoryId[index]
      //           : categoryId,
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
      //       body: fs.createReadStream(`tmp/${files[index].filename}`),
      //     },
      //   },
      //   // {
      //   //   // Use the `onUploadProgress` event from Axios to track the
      //   //   // number of bytes uploaded to this point.
      //   //   onUploadProgress: evt => {
      //   //     const progress = (evt.bytesRead / fileSize) * 100;
      //   //     readline.clearLine(process.stdout, 0);
      //   //     readline.cursorTo(process.stdout, 0, null);
      //   //     process.stdout.write(`${Math.round(progress)}% complete`);
      //   //   },
      //   // },
      //   (err, data) => {
      //     console.log(err, data);
      //     console.log('Done');
      //     sendToYT(
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

  module.exports = {sendToYT, uploadVideoFile, storage};