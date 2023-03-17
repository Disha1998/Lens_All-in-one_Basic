import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { LensAuthContext } from '../../context/LensContext';
import styles from "../../styles/Home.module.css";
import { follow, unFollow } from '../Follow/follow-unFollow';
import { profileById } from '../../context/query';
import Profile from '../profile/ProfileModal';
import { useParams } from 'react-router-dom';
function ProfileDetail() {
  const lensAuthContext = React.useContext(LensAuthContext);
  const {login, update, setUpdate } = lensAuthContext;
  const [profile, setProfile] = useState("");

  const params = useParams();
  let id = params.id;
  useEffect(() => {
    async function getProfile() {
        if (id !== null) {
            const user = await profileById(id);
            console.log(user);
            setProfile(user);
        }
    };
    getProfile();
}, [id]);

  const Follow = async () => {
    const followData = {
      id: id,
      login: login
    }
    const res = await follow(followData);
    setUpdate(!update)
    console.log(res);
  }

  const UnFollow = async () => {
    const unfollowData = {
      id: id,
      login: login
    }
    const res = await unFollow(unfollowData);
    setUpdate(!update)

    console.log(res);
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
    </>
  )


}
export default ProfileDetail;