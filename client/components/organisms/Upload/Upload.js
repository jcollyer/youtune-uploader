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

  const [activeIndex, setActiveIndex] = useState(0);
  const [videos, setVideos] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length) {
      acceptedFiles.forEach((file, index) => {
        setVideos(videos => [
          ...videos,
          { id: index, file, title: '', description: '' },
        ]);
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const updateInput = (event, inputName) => {
    const updatedCurrentVideo = {
      ...videos[activeIndex],
      [`${inputName}`]: event.currentTarget.value,
    };
    const updatedVideos = videos.map(video =>
      video.id !== updatedCurrentVideo.id ? video : updatedCurrentVideo,
    );

    setVideos(updatedVideos);
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
    }
  };

  // console.log('---------', { videos });
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
        <br />
        <br />
        <div>
          <h1 className="text-3xl font-bold">Upload List</h1>
          {videos?.map((video, index) => (
            <div
              key={video.file?.size}
              className={`${
                activeIndex === index ? 'active' : ''
              } flex flex-row border-b p-4`}
            >
              <div className="border-r flex-row mr-2 pr-2">
                <div>{video.file?.name}</div>
                <div>{video.file?.size}</div>
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
        <div>
          <label>Title</label>
          <Input
            onChange={event => updateInput(event, 'title')}
            name="title"
            value={videos[activeIndex]?.title}
            placeholder="Title"
          />
          <label>Description</label>
          <TextArea
            name="description"
            onChange={event => updateInput(event, 'description')}
            value={videos[activeIndex]?.description}
            placeholder="Description"
          />
        </div>
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
      </form>
    </div>
  );
}
