import React, { useState, useEffect } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { LensAuthContext } from '../../context/LensContext'
import { addReaction , getReactions, removeReaction} from '../Reaction/AddReaction/addReaction';
import { commentGasless, DoComment } from '../Comment/doComment';
import { Button, CardContent, Dialog, DialogActions, DialogContent, TextField, Card, CardHeader, CardActions, IconButton, Typography, Grid, Box, Accordion, AccordionSummary, AccordionDetails, Menu, MenuItem } from '@mui/material';
import DisplayComments from '../Comment/DisplayComment';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { createMirror, gaslessMirror } from '../Mirror/Mirror';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { CollectItem } from '../Collect/collect';
import ReporrtModal from '../ReportPublication/report-modal';
import { deletePublicaton } from '../DeletePublication/delete-publication-type-data';

export default function DisplayPublications({ pub }) {
    // console.log(pub?.collectModule?.amount?.value,'pub data');
    const [pid, setPid] = useState(pub?.id);
    const [comment, setComment] = useState("");
    const [likeCount, setLikeCount] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [likeUp, setLikeUp] = useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const lensAuthContext = React.useContext(LensAuthContext);
    const { profile, login, update, setUpdate } = lensAuthContext;
    useEffect(() => {
        getReact();
    }, [pid, update])

    const oppen = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCllose = () => {
        setAnchorEl(null);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const Mirror = async () => {
        const profileId = window.localStorage.getItem("profileId");
        if (profileId === undefined) {
            console.log('Please Login First!');
            return;
        }
        setLoading(true);

        const mirrorData = {
            login: login,
            proId: profileId,
            pubId: pub.id,
        }
        let res;
        if (profile?.dispatcher?.canUseRelay) {
            res = await gaslessMirror(mirrorData);
        } else {
            res = await createMirror(mirrorData);
        }
        if (res) {
            console.log(res, 'cmnt response');
        }
        setUpdate(!update);

    }
    const commentUpload = async () => {
        const profileId = window.localStorage.getItem("profileId");
        if (comment.length !== 0) {
            if (profileId === undefined) {
                console.log('Please Login First!');
                return;
            }
            setLoading(true);

            const commentData = {
                comment: comment,
                login: login,
                profile: profile,
                proId: profileId,
                pubId: pub.id,
                user: profile.name ? profile.name : profile.handle
            }
            console.log(commentData, 'cmt data');
            let res;
            if (profile?.dispatcher?.canUseRelay) {
                console.log('gasless');
                res = await commentGasless(commentData);
                setUpdate(!update)
                handleClose();
            } else {
                res = await DoComment(commentData)
                setUpdate(!update)
                handleClose();
            }

        }
    }

    const Collect = async () => {
        const profileId = window.localStorage.getItem("profileId");

        const collectData = {
            proId: profileId,
            pubId: pub.id,
            login: login,
            value: pub.collectModule.amount.value
        }
        const res = await CollectItem(collectData);
        setUpdate(!update);
        if (res) {
            console.log(res, 'res from collect mod');
        }
    }

    const addReactions = async (data) => {
        if (!profile) {
            alert("Please Login First!");
            return;
        }
        const id = window.localStorage.getItem("profileId");
        const pId = data?.id;
        console.log(pId, 'publish id');
        const dd = {
            id: id,
            address: profile.ownedBy,
            publishId: pId,
            login: login
        }
        let res;
        if (likeUp === false) {
            res = await addReaction(dd);
        }
        else {
            res = await removeReaction(dd);
            console.log('res--removeReaction', res);
        }
        if (res === undefined) {
            setUpdate(!update);
        }
    }
    const getReact = async () => {
        const res = await getReactions(pid);

        if (profile) {
            const like = res.items && res.items.filter((e) => e?.profile.id === profile.id);
            if (like.length === 0) {
                setLikeUp(false)
            } else {
                setLikeUp(true)
            }
        }
        setLikeCount(res.items.length);
    }

    const  handleDeletePublication=async(id)=>{
        setLoading(true);
        const dd = {
            id: id,
            address: profile.ownedBy, 
            login: login
        } 
      const res = await deletePublicaton(dd); 
      if(res.data.hidePublication === null){ 
        setLoading(false);
        handleClose();
        alert("Post successfully deleted!"); 
      }
      setLoading(false);
      setUpdate(!update);
      handleClose();
    } 
    return (
        <>
            <Box >
                <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
                    <div >
                        <Grid item xs={2} sm={4} md={4}>
                            <Card style={{ marginTop: "120%", width: "20vw", height: "100%", margin: "30px" }}  >
                                <CardHeader

                                    avatar={
                                        <img style={{ height: "70px", width: "70px", borderRadius: "50%" }}
                                            src={pub?.profile?.picture?.original?.url}
                                            alt="new"
                                        />}
                                    action={
                                        <IconButton aria-label="settings"
                                            id="basic-button"
                                            aria-controls={oppen ? 'basic-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={oppen ? 'true' : undefined}
                                            onClick={handleClick}
                                        >

                                            <MoreVertIcon />
                                        </IconButton>

                                    }
                                    title={pub?.profile?.handle}
                                    subheader={pub?.profile?.ownedBy?.slice(1, 10)}
                                />
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={oppen}
                                    onClose={handleCllose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                   <ReporrtModal pubId = {pub.id}
                                   data = {pub}
                                   />
                                </Menu>
                                <img style={{height:"215px"}} src={pub?.metadata?.media[0]?.original?.url} ></img>
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        <h2>{pub?.metadata?.content}</h2>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <h2>{pub?.metadata?.description}</h2>
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <IconButton aria-label="add to favorites"
                                        onClick={() => addReactions(pub)}
                                    >                                        {
                                            likeUp === 0 ? <FavoriteIcon /> : <FavoriteIcon />}
                                        {likeCount}
                                    </IconButton>
                                    <IconButton aria-label="share">
                                        <div>
                                            <IconButton onClick={handleClickOpen}>
                                                {
                                                    likeUp === 0 ? <ChatIcon /> : <ChatIcon />}{pub?.stats?.totalAmountOfComments}
                                            </IconButton>
                                            <Dialog open={open} onClose={handleClose}>
                                                <DialogContent>
                                                    <TextField
                                                        onChange={(e) => setComment(e.target.value)}
                                                        autoFocus
                                                        margin="dense"
                                                        id="name"
                                                        label="Write a comment"
                                                        type="text"
                                                        fullWidth
                                                    />
                                                </DialogContent>
                                                <DialogActions>

                                                    <Button onClick={commentUpload}>Send
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>
                                        </div>
                                    </IconButton>
                                    <IconButton onClick={Mirror}>
                                        {likeUp === 0 ? <SwapHorizIcon /> : <SwapHorizIcon />}{pub?.stats?.totalAmountOfMirrors}
                                    </IconButton>

                                    <IconButton onClick={Collect}>
                                        {likeUp === 0 ? <AddCircleOutlineIcon /> : <AddCircleOutlineIcon />}{pub?.stats?.totalAmountOfCollects}
                                    </IconButton>

                                </CardActions>
                                <DisplayComments pubId={pub.id} />
                            </Card>
                        </Grid>
                    </div>
                </Grid>
            </Box>
        </>
    );
}