import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import * as R from 'ramda';
import { PlusSquareOutlined, FileAddOutlined } from '@ant-design/icons';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import moment from 'moment';
import Cookies from 'js-cookie';
import Categories from '../../../services/categories';

const transparentImage = require('../../../assets/images/transparent.png');

export default function UploadPage() {
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

  const [activeIndex, setActiveIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [playlistToken] = useState(Cookies.get('userPlaylistId'));
  const [tokens] = useState(Cookies.get('tokens'));
  const [progress, setProgress] = useState(0);

  const uploadConfig = {
    onUploadProgress: progressEvent => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );

      setProgress(percentCompleted);
    },
  };

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length) {
      acceptedFiles.forEach((file, index) => {
        setVideos(videos => [
          ...videos,
          {
            id: index,
            file,
            title: '',
            description: '',
            scheduleDate: '',
            category: '',
            tags: '',
            thumbnail: transparentImage,
          },
        ]);
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const updateInput = (event, inputName, isImageUpload) => {
    console.log('----------event value-->', event.currentTarget.value);
    const updatedCurrentVideo = {
      ...videos[activeIndex],
      [`${inputName}`]: isImageUpload
        ? URL.createObjectURL(event.target.files[0])
        : event.currentTarget.value,
    };
    const updatedVideos = videos.map(video =>
      video.id !== updatedCurrentVideo.id ? video : updatedCurrentVideo,
    );

    setVideos(updatedVideos);
  };

  const onSubmit = event => {
    event.preventDefault();
    if (videos.length) {
      console.log('Tokens-->', { playlistToken, tokens });
      const formData = new FormData();
      videos.forEach(video => {
        formData.append('file', video.file);
        formData.append('title', video.title || '');
        formData.append('description', video.description || '');
        formData.append('scheduleDate', video.scheduleDate || new Date().toDateString());
        formData.append(
          'categoryId',
          Categories.filter(c => c.label === video.category)[0]?.id || 1,
        );
        formData.append('tags', video.tags);
        formData.append('thumbnail', video.thumbnail);
      });
      formData.append('playlistToken', playlistToken);
      formData.append('tokens', tokens);

      axios.post('api/auth/uploadVideo', formData, uploadConfig).then(response => {
        console.log('axios->', response.data);
        if (!tokens) {
          window.open(
            response.data,
            'SomeAuthentication',
            'width=672,height=660,modal=yes,alwaysRaised=yes',
          );
        }
      });

      setVideos([]);
    }
  };

  console.log('---------', { videos, loading });
  return (
    <div className="flex flex-col max-w-xl m-auto">
      <h3 className="text-center mt-20 text-3xl mb-12">Upload Video</h3>
      <form action="uploadVideo" method="post" encType="multipart/form-data">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            style={{
              width: '100%',
              height: '180px',
              border: '1px solid lightgray',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} name="file" />
            <PlusSquareOutlined style={{ fontSize: '3rem' }} className="mr-4" />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Click to add files</p>
            )}
          </div>
        </div>
        <div className="my-10">
          {!!videos.length && <h3 className="text-1xl">Upload List:</h3>}
          {videos?.map((video, index) => (
            <div
              key={video.id}
              className={`${
                activeIndex === index ? 'active' : ''
              } flex flex-row border-b p-4`}
            >
              <div className="border-r flex-row mr-2 pr-2">
                <div>{video.file?.name}</div>

                <div>{`${Math.round(video.file.size / 100000) / 10}MB`}</div>
              </div>
              <div
                className="flex-row"
                onClick={() => setActiveIndex(index)}
                onKeyDown={() => setActiveIndex(index)}
              >
                <div
                  className={`${
                    activeIndex !== index ? 'flex' : 'hidden'
                  } flex-col`}
                >
                  <div>{`Title: ${video.title}`}</div>
                  <div>{`Description: ${video.description}`}</div>
                  <div>
                    {`Scheduled Date: ${moment(video.scheduleDate).format(
                      'MM/DD/YYYY',
                    )}`}
                  </div>
                  <div>{`Category: ${video.category}`}</div>
                  <div>
                    <span>Tags:</span>
                    {video.tags.split(', ').map(tag => (
                      <span key={tag} className="bg-white rounded-lg px-2 ml-2">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div>
                    <img src={video.thumbnail} alt="thumbnail" width="35" />
                  </div>
                </div>
                <div
                  className={`${
                    activeIndex === index ? 'flex' : 'hidden'
                  } flex-col`}
                >
                  <input
                    onChange={event => updateInput(event, 'title')}
                    className="border-0 outline-0 bg-transparent border-b border-slate-300"
                    name="title"
                    value={videos[activeIndex]?.title}
                    placeholder="Title"
                  />
                  <textarea
                    name="description"
                    className="border-0 outline-0 bg-transparent border-slate-300  h-6"
                    onChange={event => updateInput(event, 'description')}
                    value={videos[activeIndex]?.description}
                    placeholder="Description"
                  />
                  <input
                    type="date"
                    onChange={event => updateInput(event, 'scheduleDate')}
                    className="border-0 outline-0 bg-transparent border-slate-300"
                    name="scheduleDate"
                    value={videos[activeIndex]?.scheduleDate}
                    placeholder="Schedule Date"
                  />
                  <select
                    onChange={event => updateInput(event, 'category')}
                    className="border-0 outline-0 bg-transparent border-slate-300"
                    name="category"
                    value={videos[activeIndex]?.category}
                    placeholder="Category"
                  >
                    {Categories.map(item => (
                      <option key={item.label} value={item.label}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <textarea
                    name="tags"
                    className="border-0 outline-0 bg-transparent border-slate-300  h-6"
                    onChange={event => updateInput(event, 'tags')}
                    value={videos[activeIndex]?.tags}
                    placeholder="Tags"
                  />

                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt="thumbnail"
                      width="55"
                      className="opacity-50"
                    />

                    <label htmlFor="thumbnial">
                      <FileAddOutlined
                        style={{ fontSize: '30px' }}
                        className="top-4 left-4 absolute"
                      />
                    </label>
                    <input
                      type="file"
                      onChange={event => updateInput(event, 'thumbnail', true)}
                      name="thumbnail"
                      accept="image/png, image/jpeg, application/octet-stream"
                      placeholder="thumbnail"
                      className="hidden"
                      id="thumbnial"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!!videos.length && (
          <button
            type="submit"
            onClick={onSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        )}
      </form>
      <div className="w-full h-4 mb-4 bg-gray-200 rounded-full dark:bg-gray-700">
        <div
          className="h-4 bg-gray-400 rounded-full dark:bg-gray-600"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
