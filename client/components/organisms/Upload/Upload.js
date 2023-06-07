import React, { useCallback, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { push } from 'redux-first-history';
// import * as R from 'ramda';
import { Typography, Button, Input } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

// const Private = [
//   { value: 0, label: 'Private' },
//   { value: 1, label: 'Public' },
// ];

// const Catogory = [
//   { value: 0, label: 'Film & Animation' },
//   { value: 0, label: 'Autos & Vehicles' },
//   { value: 0, label: 'Music' },
//   { value: 0, label: 'Pets & Animals' },
//   { value: 0, label: 'Sports' },
// ];

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
  const [activeIndex, setActiveIndex] = useState(0);
  // const [videoFiles, setVideoFiles] = useState([]);

  const [videos, setVideos] = useState([]);

  const onDrop = useCallback(
    acceptedFiles => {
      if (acceptedFiles.length) {
        // console.log('------onDrop--->', acceptedFiles[0]);
        // if (video.file.size > 0) {
        //   setVideos([...videos, video]);
        //   // setVideoFiels([...videoFiles, video.file]);
        // }
        // setFile(acceptedFiles[0].path);
        // const inputValue =
        acceptedFiles.forEach(file => {
          // console.log('-------file', file, videoFiles);
          // setVideoFiles([...videoFiles, file]);
          // setVideoFiles(videoFiles => [...videoFiles, file]);
          setVideos(videos => [
            ...videos,
            { file, title: '', description: '' },
          ]);
        });
      }
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleChangeTitle = event => {
    setVideo({ ...video, title: event.currentTarget.value });
  };

  const handleChangeDecsription = event => {
    console.log(event.currentTarget.value);

    setVideo({ ...video, description: event.currentTarget.value });
  };

  // const handleChangeOne = event => {
  //   setVideo({ ...video, privacy: event.currentTarget.value });
  // };

  // const handleChangeTwo = event => {
  //   setVideo({ ...video, categorie: event.currentTarget.value });
  // };

  const onSubmit = event => {
    event.preventDefault();
    if (videos.length) {
      const formData = new FormData();
      videos.forEach(video => {
        // console.log('--------formData-->',video.file);
        formData.append('file', video.file);
      });

      axios
        .post('http://localhost:3000/uploadVideo', formData)
        .then(response => {
          console.log('axios->', response.data);
        });
    } else {
      const videoData = new FormData();
      videoData.append('file', video.file);
      videoData.append('title', video.title);
      videoData.append('description', video.description);
      videoData.append('fileSize', video.file.size);

      // console.log('-----------videoData', videoData.get('file'), video.file);

      axios
        .post('http://localhost:3000/uploadVideo', videoData)
        .then(response => {
          console.log('axios->', response.data);
        });
    }
  };

  console.log('---------', { videos });
  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}> Upload Video</Title>
      </div>

      <form action="uploadVideo" method="post" encType="multipart/form-data">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            style={{
              width: '300px',
              height: '240px',
              border: '1px solid lightgray',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} name="file" />
            <PlusSquareOutlined style={{ fontSize: '3rem' }} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Click to add files</p>
            )}
          </div>
          {/* {thumbnail !== '' &&
                <div>
                    <img src={`http://localhost:5000/${thumbnail}`} alt='haha' />
                </div>
            } */}
        </div>

        {/* <div className="flex flex-col border">
          <h1 className="text-3xl font-bold">Current Video</h1>
          <div>{`File Size: ${video?.file?.size / 10000} MB`}</div>
          <div>{`Title: ${video?.title}`}</div>
          <div>{`Description: ${video?.description}`}</div>
          <div>{`Private: ${video?.privacy === 0 ? 'private' : 'public'}`}</div>
          <div>{`Catogory: ${video?.categorie}`}</div>
        </div> */}
        <br />
        <br />
        <div>
          <h1 className="text-3xl font-bold">Upload List</h1>
          {videos?.map((video, index) => (
            <div
              key={video.file.size}
              className={`${
                activeIndex === index ? 'active' : ''
              } flex flex-row border-b p-4`}
            >
              <div className="border-r flex-row mr-2 pr-2">
                <div>{video.file.name}</div>
                <div>{video.file.size}</div>
              </div>
              <div
                className="flex-row"
                onClick={() => setActiveIndex(index)}
                onKeyDown={() => setActiveIndex(index)}
              >
                <div>{`Title:${video.title}`}</div>
                <div>{`Description:${video.description}`}</div>
              </div>
            </div>
          ))}
        </div>

        <label>Title</label>
        <Input onChange={handleChangeTitle} name="title" value={video.title} />
        <label>Description</label>
        <TextArea
          name="description"
          onChange={handleChangeDecsription}
          value={video.description}
        />
        {/* <select onChange={handleChangeOne}>
          {Private.map(item => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <select onChange={handleChangeTwo}>
          {Catogory.map(item => (
            <option key={item.label} value={item.label}>
              {item.label}
            </option>
          ))}
        </select> */}

        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
        {/* <input type="submit" /> */}
      </form>
    </div>
  );
}
