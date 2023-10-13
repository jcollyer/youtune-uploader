import axios from 'axios';

export const uploadVideo = (formData:any, uploadConfig:any, tokens:string | undefined) =>
  axios
    .post('api/auth/uploadVideo', formData, uploadConfig)
    .then(response => {
      if (!tokens) {
        window.open(
          response.data,
          'SomeAuthentication',
          'width=672,height=660,modal=yes,alwaysRaised=yes',
        );
      }
    });
