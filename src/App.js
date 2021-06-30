import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './fireBase';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar'

import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import Upload from './ImageUpload'
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
    maxWidth:400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[ 5 ],
    padding: theme.spacing( 2, 4, 3 ),
  },
} ) );
function App() {
  const classes = useStyles();
  const [ modalStyle ] = useState( getModalStyle )
  const [ posts, setPosts ] = useState( [] );
  const [ open, setOpen ] = useState( false );
  const [ signIn, setOpenSignIn ] = useState( false );
  const [ email, setEmail ] = useState( '' );
  const [ username, setUsername ] = useState( '' );
  const [ password, setPassword ] = useState( '' );
  const [ user, setUser ] = useState( null )

  useEffect( () => {
    const unsubscribe = auth.onAuthStateChanged( ( authUser ) => {
      if ( authUser ) {
        setUser( authUser );
        if ( authUser.displayName ) {

        }
        else {
          return authUser.updateProfile( {
            displayName: username,
          } );
        }

      }
      else {
        setUser( null )

      }
    } )
    return () => {
      unsubscribe();
    }
  }, [user,username] )

  useEffect( () => {

    db.collection( 'posts' ).orderBy('timestamp','desc').onSnapshot( snapshot => {
      setPosts( snapshot.docs.map( doc => ( {
        id: doc.id,
        post: doc.data()
      } ) ) )
    } )
  }, [ posts ] )

  const handleSignUp = ( event ) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword( email, password )
      .then( ( authUser ) => {
        return authUser.user.updateProfile( {
          displayName: username
        } )
      } )
      .catch( err => alert( err.message ) )
    setOpen(false)


  }
  const handleSignIn = ( event ) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword( email, password )
      .catch( ( error ) => alert( error.message ) )
    setOpenSignIn( false );
  }


  return (
    <div className="app">
      <Modal
        open={ open }
        onClose={ () => setOpen( false ) }
      >
        {
          <div style={ modalStyle } className={ classes.paper }>
            <center>
              <img className="app__headerImage"
                alt=""
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              />
              <form className="app__signup">

                <Input
                  type="text"
                  placeholder="email"
                  value={ email }
                  onChange={ ( e ) => setEmail( e.target.value ) }
                ></Input>
                <Input
                  type="text"
                  placeholder="username"
                  value={ username }
                  onChange={ ( e ) => setUsername( e.target.value ) }
                ></Input>
                <Input
                  type="password"
                  placeholder="password"
                  value={ password }
                  onChange={ ( e ) => setPassword( e.target.value ) }
                ></Input>

                <Button onClick={ handleSignUp }>SignUp</Button>
              </form>

            </center>
          </div>
        }
      </Modal>
      <Modal
        open={ signIn }
        onClose={ () => setOpenSignIn( false ) }
      >
        {
          <div style={ modalStyle } className={ classes.paper }>
            <center>
              <img className="app__headerImage" alt=""
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              />
              <form className="app__signup">

                <Input
                  type="text"
                  placeholder="email"
                  value={ email }
                  onChange={ ( e ) => setEmail( e.target.value ) }
                ></Input>
                <Input
                  type="password"
                  placeholder="password"
                  value={ password }
                  onChange={ ( e ) => setPassword( e.target.value ) }
                ></Input>

                <Button onClick={ handleSignIn }>Sign In</Button>
              </form>

            </center>
          </div>
        }
      </Modal>

      
      <div className="app__header">
        <img className="app__headerImage" alt=""
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        />
        { user ? (
          <div className="navbar__container">
            <Avatar className="post__avatar"
              alt={ username }
              src="/" />
            <h4 className="display__name">{ user.displayName }</h4>
            
            <Button className="logout__container" onClick={ () => auth.signOut() } >Logout</Button>
          </div>
        ) :
          (
            <div className="navbar__container">
              
              <Button onClick={ () => setOpen( true ) } className="login__container__signup" >Sign Up</Button>
              <Button onClick={ () => setOpenSignIn( true ) } >Sign In</Button>
            </div>

          )
        }
        
      </div>
      


      {
        posts.map( ( { id, post } ) => {
          const { username, caption, imageUrl } = post;
          return <Post key={ id } user = {user}postId = {id} username={ username } caption={ caption } imageUrl={ imageUrl } />
        } )
      }
      { user?.displayName ?
        (<Upload username={ user.displayName } />) :
        (<><h4 style={{padding:'20px',textAlign:'center'}}>Sorry you have to signin to like,comment and post</h4></>)
      }
      
      
    </div>
  );
}

export default App;
