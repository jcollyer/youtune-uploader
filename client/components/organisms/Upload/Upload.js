import React, { useState } from 'react';
// import React, { useEffect, useCallback, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { push } from 'redux-first-history';
// import * as R from 'ramda';
import { Typography, Input } from 'antd';
// import { Typography, Button, Form, Input } from 'antd';
// import { PlusSquareOutlined } from '@ant-design/icons';
// import { useDropzone } from 'react-dropzone';
// import axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

const Private = [
  { value: 0, label: 'Private' },
  { value: 1, label: 'Public' },
];

const Catogory = [
  { value: 0, label: 'Film & Animation' },
  { value: 0, label: 'Autos & Vehicles' },
  { value: 0, label: 'Music' },
  { value: 0, label: 'Pets & Animals' },
  { value: 0, label: 'Sports' },
];

export default function Upload() {
  // const dispatch = useDispatch();
  // const { user } = useSelector(R.pick(['user']));

  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (R.isEmpty(user)) {
  //     dispatch(push('/login'));
  //   } else {
  //     setLoading(false);
  //   }
  // }, [dispatch, user]);

  const [video, setVideo] = useState({
    file: { size: 0 },
    title: '',
    description: '',
    privacy: 0,
    categorie: 'Film & Animation',
  });

  // const [videos, setVideos] = useState([]);

  // const onDrop = useCallback(
  //   acceptedFiles => {
  //     console.log('------onDrop--->', typeof acceptedFiles);
  //     if (acceptedFiles[0]) {
  //       if (video.file.size > 0) {
  //         setVideos([...videos, video]);
  //       }
  //       // setFile(acceptedFiles[0].path);
  //       // const inputValue =
  //       setVideo({ ...video, file: acceptedFiles[0] });
  //     }
  //   },
  //   [video, videos],
  // );

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleChangeTitle = event => {
    setVideo({ ...video, title: event.currentTarget.value });
  };

  const handleChangeDecsription = event => {
    console.log(event.currentTarget.value);

    setVideo({ ...video, description: event.currentTarget.value });
  };

  const handleChangeOne = event => {
    setVideo({ ...video, privacy: event.currentTarget.value });
  };

  const handleChangeTwo = event => {
    setVideo({ ...video, categorie: event.currentTarget.value });
  };

  // const onSubmit = event => {
  //   event.preventDefault();
  //   // console.log('--------form-->', file, title, Description);
  //   if (videos.length) {
  //     const videosArray = videos.map(video => {
  //       const videoData = new FormData();

  //       videoData.append('file', video.file);
  //       // videoData.append('file', JSON.stringify(video.file));
  //       videoData.append('title', video.title);
  //       // videoData.append('title', JSON.stringify(video.title));
  //       videoData.append('description', video.description);
  //       // videoData.append('description', JSON.stringify(video.description));
  //       videoData.append('fileSize', video.file.size);
  //       // videoData.append('fileSize', JSON.stringify(video.fileSize));

  //       return videoData;
  //     });
  //     const stringData = JSON.stringify(videosArray);
  //     const object = {};
  //     videosArray.forEach((value, key) => {
  //       console.log('----forEach==>', key, value);
  //       object[key] = value;
  //     });
  //     const json = JSON.stringify(object);
  //     console.log('----post many---', {
  //       title: videosArray[1].get('title'),
  //       stringData,
  //       object,
  //     });
  //     const videoData = new FormData();
  //     axios
  //       .post(
  //         'http://localhost:3000/uploadVideo',
  //         videoData.append('array', videosArray),
  //       )
  //       .then(response => {
  //         console.log('axios->', response.data);
  //       });
  //   } else {
  //     const videoData = new FormData();

  //     videoData.append('file', video.file);
  //     videoData.append('title', video.title);
  //     videoData.append('description', video.description);
  //     videoData.append('fileSize', video.file.size);

  //     console.log('-----------videoData', videoData.get('file'), video.file);

  //     axios
  //       .post('http://localhost:3000/uploadVideo', videoData)
  //       .then(response => {
  //         console.log('axios->', response.data);
  //       });
  //   }
  // };

  // console.log('---------', { loading, videos });
  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}> Upload Video</Title>
      </div>

      <form action="uploadVideo" method="post" encType="multipart/form-data">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* <div
            style={{
              width: '300px',
              height: '240px',
              border: '1px solid lightgray',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            {...getRootProps()}>
            <input {...getInputProps()} />
            <PlusSquareOutlined style={{ fontSize: '3rem' }} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Click to add files</p>
            )}
          </div> */}
          <label>Video file: </label>
          <input type="file" name="file" />
          <label>title </label>
          <input type="text" name="title" />
          <label>Video file: </label>
          <input type="file" name="file2" />
          <label>title </label>
          <input type="text" name="title2" />
          {/* {thumbnail !== '' &&
                <div>
                    <img src={`http://localhost:5000/${thumbnail}`} alt='haha' />
                </div>
            } */}
        </div>

        <br />
        <br />
        <label>Title</label>
        <Input onChange={handleChangeTitle} value={video.title} />
        <br />
        <br />
        <label>Description</label>
        <TextArea
          onChange={handleChangeDecsription}
          value={video.description}
        />
        <br />
        <br />

        <select onChange={handleChangeOne}>
          {Private.map(item => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />

        <select onChange={handleChangeTwo}>
          {Catogory.map(item => (
            <option key={item.label} value={item.label}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />

        {/* <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button> */}
        <input type="submit" />
      </form>
      <div>
        {/* <h1>single video</h1>
        <div>{video?.file.size}</div>
        <div>{video?.title}</div>
        <div>{video?.description}</div>
        <div>{video?.privacy === 0 ? 'privet' : 'public'}</div>
        <div>{video?.categorie}</div> */}
      </div>
      <br />
      <br />
      <br />
      <div>
        <h1>Multiple Videos</h1>
        {/* {videos &&
          videos.map(video => (
            <ul key={video.title}>
              <li>{video?.file.size}</li>
              <li>{video?.title}</li>
              <li>{video?.description}</li>
              <li>{video?.privacy === 0 ? 'privet' : 'public'}</li>
              <li>{video?.categorie}</li>
            </ul>
          ))} */}
      </div>
    </div>
  );
}
