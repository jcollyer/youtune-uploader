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

  const [videoFiles, setVideoFiels] = useState([]);

  const [videos, setVideos] = useState([]);

  const onDrop = useCallback(
    acceptedFiles => {
      if (acceptedFiles[0]) {
        console.log('------onDrop--->', acceptedFiles[0]);
        if (video.file.size > 0) {
          setVideos([...videos, video]);
          setVideoFiels([...videoFiles, video.file]);
        }
        // setFile(acceptedFiles[0].path);
        // const inputValue =
        setVideo({ ...video, file: acceptedFiles[0] });
      }
    },
    [video, videos, videoFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
    if (videoFiles.length) {
      const formData = new FormData();
      videoFiles.forEach(file => {
        formData.append('file', file);
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

      console.log('-----------videoData', videoData.get('file'), video.file);

      axios
        .post('http://localhost:3000/uploadVideo', videoData)
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
        <label>Title</label>
        <Input onChange={handleChangeTitle} name="title" value={video.title} />
        <br />
        <br />
        <label>Description</label>
        <TextArea
          name="description"
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
        {/* <input type="submit" /> */}
      </form>
      <div>
        <h1>single video</h1>
        <div>{video?.file.size}</div>
        <div>{video?.title}</div>
        <div>{video?.description}</div>
        <div>{video?.privacy === 0 ? 'privet' : 'public'}</div>
        <div>{video?.categorie}</div>
      </div>
      <br />
      <br />
      <br />
      <div>
        <h1>Multiple Videos</h1>
        {videos?.map(video => (
          <ul key={video.title}>
            <li>{video?.file.size}</li>
            <li>{video?.title}</li>
            <li>{video?.description}</li>
            <li>{video?.privacy === 0 ? 'privet' : 'public'}</li>
            <li>{video?.categorie}</li>
          </ul>
        ))}
      </div>
    </div>
  );
}
