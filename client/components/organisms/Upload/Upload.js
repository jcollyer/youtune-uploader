import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import * as R from 'ramda';
import { Typography, Button, Form, Input } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

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
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (R.isEmpty(user)) {
      dispatch(push('/login'));
    } else {
      setLoading(false);
    }
  }, [dispatch, user]);

  const [video, setVideo] = useState({
    file: { size: 0 },
    title: '',
    description: '',
    privacy: 0,
    categorie: 'Film & Animation',
  });

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

  const onSubmit = event => {
    event.preventDefault();
    // console.log('--------form-->', file, title, Description);
    const videoData = new FormData();

    videoData.append('videoFile', video.file);
    videoData.append('title', video.title);
    videoData.append('description', video.description);
    videoData.append('fileSize', video.file.size);
    // console.log('-----------videoData', videoData.get('file'));

    axios
      .post('http://localhost:3000/uploadVideo', videoData)
      .then(response => {
        console.log('axios->', response.data);
      });
  };

  const onDrop = useCallback(
    acceptedFiles => {
      console.log('--------->', typeof acceptedFiles);
      if (acceptedFiles[0]) {
        // setFile(acceptedFiles[0].path);
        // const inputValue =
        setVideo({ ...video, file: acceptedFiles[0] });
      }
    },
    [video],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  console.log(loading);
  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}> Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
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
            <input {...getInputProps()} />
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

        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
      <div>
        <div>{video?.file.size}</div>
        <div>{video?.title}</div>
        <div>{video?.description}</div>
        <div>{video?.privacy === 0 ? 'privet' : 'public'}</div>
        <div>{video?.categorie}</div>
      </div>
    </div>
  );
}
