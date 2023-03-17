import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import RandomProfiles from "../lens/ExploreProfile/displayRandomProfiles";
import { LensAuthContext } from "../context/LensContext";
import React from "react";

function Header () {

    const lensAuthContext = React.useContext(LensAuthContext);
    const { profile, login, setUpdate, update } = lensAuthContext;
    return(
        <div>
            <Button className='m-2' style={{ background: '#488E72', color: 'white', textTransform: 'capitalize' }} onClick={login}>
              Login
            </Button>
            <Link to='/createPost'>
              <Button className='m-2' style={{ background: '#488E72', color: 'white', textTransform: 'capitalize' }} >
                Create Post
              </Button>
            </Link>
            <Link to='/Createprofile'>
              <Button className='m-2' style={{ background: '#488E72', color: 'white', textTransform: 'capitalize' }} >
                Create Profile
              </Button>
            </Link>
            <Link to='/profile'>
              <Button className='m-2' style={{ background: 'rgb(35 51 44)',right:"0", color: 'white', textTransform: 'capitalize' }} >
                Profile
              </Button>
            </Link>
            <Link to='/publications'>
              <Button className='m-2' style={{ background: 'rgb(35 51 44)',right:"0", color: 'white', textTransform: 'capitalize' }} >
                Publications
              </Button>
            </Link>
            <RandomProfiles/>
          </div>
    )
}
export default Header;