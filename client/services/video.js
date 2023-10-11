import axios from 'axios';

export const uploadVideo = (formData, uploadConfig, tokens) =>
  axios
    .post('api/auth/uploadVideo', formData, uploadConfig, tokens)
    .then(response => {
      if (!tokens) {
        window.open(
          response.data,
          'SomeAuthentication',
          'width=672,height=660,modal=yes,alwaysRaised=yes',
        );
      }
    });
