import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { LensAuthContext } from '../../context/LensContext';
import { follow, unFollow } from '../Follow/follow-unFollow';
import { Button } from '@mui/material';
function RandomProfileCard(props) {
    const lensAuthContext = React.useContext(LensAuthContext);
    const { profile, login, update, setUpdate } = lensAuthContext;
    const Follow = async () => {
        const followData = {
            id: profile.id,
            login: login
        }
        const res = await follow(followData);
        setUpdate(!update)
        console.log(res);
    }
    return (
        <div style={{ height: '34rem' }} className="container">

            <div className='title-box'>
                <div className='under-line'></div>
            </div>
            <div style={{ backgroundColor: "#ecddc9" }}>
                <p style={{ marginTop: "14px" }} className='book-price'>@{props.data.handle}</p>
                <img style={{ height: "100px", width: "130px" }} src={props.data.picture == null ? "https://superfun.infura-ipfs.io/ipfs/QmRY4nWq3tr6SZPUbs1Q4c8jBnLB296zS249n9pRjfdobF" : props.data.picture.original.url} alt="Credit to Joshua Earle on Unsplash" />
                <center> <Button style={{ marginBottom: "14px" }} onClick={Follow} className='mt-3' variant='outlined'>Follow</Button></center>
            </div>
        </div>
    );
}

export default RandomProfileCard;