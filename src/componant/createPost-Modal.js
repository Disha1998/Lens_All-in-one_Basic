import React from "react";
import { Buffer } from 'buffer';
import { create } from 'ipfs-http-client';
import { Button, CircularProgress } from "@mui/material";
import { LensAuthContext } from "../context/LensContext";
import { createPost, createPostViaDispatcher } from "../lens/create-post";
console.log(process.env.REACT_APP_INFURA_PROJECT_KEY, process.env.REACT_APP_INFURA_APP_SECRET_KEY)
const auth =
    "Basic " +
    Buffer.from(
        process.env.REACT_APP_INFURA_PROJECT_KEY + ":" + process.env.REACT_APP_INFURA_APP_SECRET_KEY
    ).toString("base64");

const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
        authorization: auth,
    },
});

export default function UploadModal() {

    const lensAuthContext = React.useContext(LensAuthContext);
    const { profile, login, update, setUpdate } = lensAuthContext;
    // console.log(profile,'profile');
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [file, setFile] = React.useState("");
    const [amount, setAmount] = React.useState();
    const [number, setNumber] = React.useState();
    const [loading, setLoading] = React.useState(false);

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        const ipfsResult = await client.add(file);
        const imageURI = `https://superfun.infura-ipfs.io/ipfs/${ipfsResult.path}`;
        console.log(imageURI,'img link');
        setFile(imageURI);

    }

    const handleUpload = async () => {
        const fId = window.localStorage.getItem("profileId");
        if (title.length !== 0 && (file !== "" || description !== "")) {
            if (fId === undefined) {
                console.log('Please Login First!');
                return;
            }

            setLoading(true);
            const postData = {
                title: title,
                photo: file,
                amount: amount,
                description: description,
                login: login,
                name: profile.handle,
                profile: profile,
                number:number
            }
            let res;
            if (profile?.dispatcher?.canUseRelay) {
                res = await createPostViaDispatcher(postData);
            } else {
                res = await createPost(postData);
            }
            if (res) {
                setUpdate(!update);
                setFile("");
                setTitle("");
                setDescription("");
                setLoading("");

            }
        }
    }

    return (
        <>
            <input
                onChange={(e) => setTitle(e.target.value)}
                type="text" placeholder="Title" className="title" /><br /><br />
            <textarea
                onChange={(e) => setDescription(e.target.value)}
                rows={3} type="text" placeholder="description" className="take-note" autoFocus="autofocus " /><br /><br />

            <input
                onChange={(e) => setAmount(e.target.value)}
                type="number" placeholder="amount" className="title" />
            <br></br>
            <br></br>
            <input
                onChange={(e) => setNumber(e.target.value)}
                type="number" placeholder="number of NFTs" className="title" />
            <br></br>
            <br></br>

            <input type="file"
                onChange={(e) => handleUploadImage(e)}
            >
            </input>

            <label
                htmlFor="file"
                style={{ width: '100%', cursor: 'pointer' }}
                className="rounded-3 text-center p-1   js-labelFile   " >
            </label>


            <Button onClick={handleUpload}>{loading ? <CircularProgress size={20} /> : "Upload"}</Button>
        </>
    )
}