import { Button, Modal } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import { IconButton } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from './fireBase'
import firebase from 'firebase'
import './ImageUpload.css'

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${ top }%`,
        left: `${ left }%`,
        transform: `translate(-${ top }%, -${ left }%)`,
    };
}
const useStyles = makeStyles( ( theme ) => ( {
    paper: {
        position: 'absolute',
        width: '60%',
        maxWidth: 500,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[ 5 ],
        padding: theme.spacing( 2, 4, 3 ),
    },
} ) );

const ImageUpload = ( { username } ) => {
    const classes = useStyles();
    const [ image, setImage ] = useState( null );
    const [ progress, setProgress ] = useState( 0 );
    const [ caption, setCaption ] = useState( '' );
    const [ flag, setFlag ] = useState( false );
    const [ src, setSrc ] = useState( '#' );
    const [ open, setOpen ] = useState( false );
    const [ modalStyle ] = useState( getModalStyle )

    useEffect( () => {
        if ( image ) {
            setSrc( window.URL.createObjectURL( image ) );
        }
        else {
            setSrc( '#' )
        }
    }, [ image ] )


    const handleChange = ( e ) => {
        if ( e.target.files[ 0 ] ) {
            var filesize = ( ( e.target.files[ 0 ].size / 1024 ) / 1024 ).toFixed( 4 );
            if ( filesize <= 20 ) {
                setImage( e.target.files[ 0 ] )
            }
            else {
                alert( 'file size too large, limit(20 MB)' )
                setImage( null );
                setOpen( false );
            }

        }
    }
    const handleUpload = () => {
        setFlag( true );
        const imageID = uuidv4();
        let imageName = image.type;
        const imageUpload = imageID + "." + imageName.split( '/' ).pop();
        
        const uploadTask = storage.ref( `images/${ imageUpload }` ).put( image );
        uploadTask.on(
            "state_changed",
            ( snapshot ) => {
                const progress = Math.round(
                    ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100
                );
                setProgress( progress );
            },
            ( error ) => {
                console.log( error );
                alert( error.message );
            },
            () => {
                storage
                    .ref( "images" )
                    .child( imageUpload )
                    .getDownloadURL()
                    .then( url => {
                        db.collection( "posts" ).add( {
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        } )
                        setProgress( 0 );
                        setCaption( "" );
                        setImage( null );
                        setFlag( false );
                        setOpen(false)
                    } )


            }
        )
    }

    return (

        <>
            <Modal
                open={ open }
                onClose={ () => setOpen( false ) }
            >
                {
                    <div style={ modalStyle } className={ classes.paper }>
                        <center>
                            <div className="imageUpload">
                                { image && <img src={ src } alt="" className="preview__image"></img> }
                                { flag && <progress className="imageUpload__progress" value={ progress } max="100" /> }
                                <input type="text" className="caption" placeholder="Enter a caption..." onChange={ event => setCaption( event.target.value ) } value={ caption } />
                                <div className="upload__container">
                                    <label htmlFor="file-upload" className="imageUpload__button">
                                        IMAGE
                                    </label>
                                    <input id="file-upload" type="file" onChange={ handleChange } />
                                    <Button className="image__upload" onClick={ handleUpload } disabled={ !image }>Upload</Button>
                                </div>
                            </div>


                        </center>
                    </div>
                }
            </Modal>
            <IconButton className="image__toggler" onClick={ () => setOpen( !open ) }>
                <AddAPhotoIcon ></AddAPhotoIcon>
            </IconButton>

        </>
    )
}

export default ImageUpload