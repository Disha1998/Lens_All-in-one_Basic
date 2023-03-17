import { Button } from '@mui/material';
import { style } from '@mui/system';
import React, { useEffect, useRef, useState } from 'react';
import { LensAuthContext } from '../../context/LensContext';
import styles from "../../styles/Home.module.css";
import DisplayCollectedPubs from '../Collect/DisplayCollect';
import { disableDispatFun, enableDispatFun } from '../Dispatcher/enable-disable-dispatcher';
import { follow, unFollow } from '../Follow/follow-unFollow';
import DisplayMirror from '../Mirror/DisplayMirror';

function Profile() {
  const lensAuthContext = React.useContext(LensAuthContext);
  const { profile, login, update, setUpdate } = lensAuthContext;
  console.log(profile, 'profile');

  const Follow = async () => {
    const followData = {
      id: profile.id,
      login: login
    }
    const res = await follow(followData);
    setUpdate(!update)
    console.log(res);
  }

  const UnFollow = async () => {
    const unfollowData = {
      id: profile.id,
      login: login
    }
    const res = await unFollow(unfollowData);
    setUpdate(!update)

    console.log(res);
  }
  const handleDisableDispatcher = async () => {
    if (!profile) {
        console.log("Please Login!");
        return;
    } else {
        const res = await disableDispatFun(profile.id);
        alert("Successfully Disable Dispatcher!")
        setUpdate(!update);
    }
}
const handleEnableDispatcher = async () => {
  if (!profile) {
      console.log("Please Login!");
      return;
  } else {
      const res = await enableDispatFun(profile.id);
      alert("Successfully Enable Dispatcher!")
      setUpdate(!update);
  }
}
  return (
    <>
    <div className={styles.container}>
      <img className={styles.banner}
        src={profile?.coverPicture?.original.url}
        alt="cover"
      >
      </img>
      <div className={styles.profile}>
        <div className={styles.profileLeft}>
          <img className={styles.profileImg}
            src={profile?.picture?.original.url}
            alt="profileImg"
          >
          </img>
          <div className={styles.info}>
            <div className={styles.name}>{profile.name}</div>
            <div className={styles.handle}>{profile.handle}</div>
            {
              profile && profile.dispatcher == null ? <Button color='success' onClick={handleEnableDispatcher}>Enable Dispatcher</Button> : <Button color='error' onClick={handleDisableDispatcher}>Disable Dispatcher</Button>
            }
            <div className={styles.bio}>{profile.bio ? profile.bio : "No bio available 😢"}</div>
            <div>
              <Button onClick={Follow} className='mt-3' variant='outlined'>Follow</Button>
              <Button onClick={UnFollow} className='mt-3' variant='outlined'>UnFollow</Button>
            </div>
            <div className={styles.follow}>{profile.follow}</div>
            <div>Followers</div>
            <div>{profile.stats?.totalFollowers}</div>
            <div className={styles.follow}>
              <div>Following</div><br></br>
              <div>{profile.stats?.totalFollowing}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div>
      <DisplayMirror/>
    </div>
    <div>
      <DisplayCollectedPubs/>
    </div>
    </>
  )


}
export default Profile;