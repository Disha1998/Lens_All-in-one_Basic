import { useEffect, useState } from "react";
import { getRandomProfiles } from "./explore-profile-type-data";
import UserCard from "./useCard";
import Slider from "react-slick";
import { Avatar, FormControl, Input, InputAdornment, InputLabel, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { search } from "../searchProfile/searchProfile";
import { useNavigate } from "react-router-dom";
function RandomProfiles() {
    const [randomProfiles, setRandomProfiles] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [keyword, setKeyword] = useState("");

    const navigate = useNavigate();
    const handleNavigate = (id) => {
        navigate(`/newprofile/${id}`)
        setSearchData("");
    }
    const settings = {
        dots: false,
        autoplay: false,
        infinite: true,
        slidesToShow: 8,
        slidesToScroll: 3,
        errow: 4
    };
    useEffect(() => {
        async function getCreator() {
            var user = [];
            const res = await getRandomProfiles();

            res.exploreProfiles.items && res.exploreProfiles.items.map((e, i) => {
                user.push(e);
            })
            setRandomProfiles(user)
        }
        getCreator()
    }, [])
    const handleSearch = async (e) => {
        setKeyword(e);
        const res = await search(e);
        setSearchData(res.search.items)
    }
    return (
        <>
            <div>
                <center><h3 style={{ marginTop: "62px" }}>Top Profiles</h3></center>

                <FormControl style={{margin:"13px 0px 13px 73px"}} variant="standard">
        <Input
        onChange={(e) => handleSearch(e.target.value)}
          id="input-with-icon-adornment"
          placeholder="search profile.."
          value={keyword}
          startAdornment={
            // <InputAdornment position="start">
              <SearchIcon />
            // </InputAdornment>
          }
        />
      </FormControl>
      <List style={{ position: 'absolute', top: '202px',left:"70px", zIndex:"1", background: '#b08787', maxHeight: '400px', overflowY: 'scroll' }}>
                                {
                                    searchData && searchData.map((e, i) => {
                                        return (
                                            <ListItem onClick={() => handleNavigate(e.profileId)} key={i} >
                                                <ListItemAvatar>
                                                    <Avatar src={e.picture == null ? 'assets/bg.png' : e.picture.original && e.picture.original.url}>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={e.handle} />
                                            </ListItem>
                                        )
                                    })
                                }

                            </List>
                <Slider {...settings}>
                    {
                        randomProfiles && randomProfiles.map((e, i) => {
                            return (

                                <UserCard
                                    key={i} data={e} index={i}
                                />
                            )
                        })
                    }
                </Slider>

            </div>
        </>
    )
}
export default RandomProfiles;