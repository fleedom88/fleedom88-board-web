import React from 'react'
import './style.css';
import { CommentListItem } from 'types/interface';
import defaultProfileImage from 'assets/image/defaultProfileImage.jpg'

import dayjs from 'dayjs';

interface Props{
    commentListItem: CommentListItem
}

//          component Comment List Item 컴포넌트            //
export default function CommentItem({commentListItem}:Props) {


//         state: properties                  //
const {nickname, profileImage, writeDatetime, content } = commentListItem;

//          function: 작성일 경과시간 함수              //
const getElapsedTime = () => {
    const now = dayjs().add(9, 'hour');
    const wrtieTime = dayjs(writeDatetime);

    const gap = now.diff(wrtieTime,'s');
    if ( gap < 60 ) return `${gap}초 전`;
    if ( gap < (60*60) ) return `${Math.floor(gap/60)}분 전`;
    if ( gap < (60*60*12)  ) return `${Math.floor(gap/3600)}시간 전`;

    return `${Math.floor(gap / (60*60*12))}일 전`;
}

//          render: Comment List Item 렌더링            //
  return (
    <div className='comment-list-item'>
        <div className='comment-list-item-top'>
            <div className='comment-list-item-profile-box'>
                <div className='comment-list-item-profile-image' style={{ backgroundImage: `url(${profileImage? profileImage:defaultProfileImage})`}}></div>
            </div>
            <div className='comment-list-item-nickname'>{nickname}</div>
            <div className='comment-list-item-divider'>{'\|'}</div>
            <div className='comment-list-item-time'>{getElapsedTime()}</div>
        </div>
        <div className='comment-list-item-main'>
            <div className='comment-list-item-content'>
                {content}
            </div>
        </div>
    </div>
  )
}
