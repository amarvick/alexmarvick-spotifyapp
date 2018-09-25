/* File Name: modal.js                                              *
 * Description: Bootstrap modal                                     */

import React, { Component, StartupActions } from 'react'
import { ButtonToolbar, Button, Modal } from 'react-bootstrap'
import { connect } from 'react-redux'

class TheModal extends Component {
    constructor(props) {
      super(props)
  
    //   this.handleShow = this.handleShow.bind(this)
      this.closeModal = this.closeModal.bind(this)
  
      this.state = {
        show: true
      }
    }

  
    closeModal() {
    //   this.props.closeModal()
    }
  
    render(props) {
      return (
        <div>
          <Modal show={this.state.show} onHide={this.closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
  
              <hr />
  
              <h4>Overflowing text to show scroll behavior</h4>
              <p>
                Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
                ac consectetur ac, vestibulum at eros.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleClose}>Ok</Button>
            </Modal.Footer>
          </Modal>
        </div>
      )
    }
  }

  // wraps dispatch to create nicer functions to call within our component
  // Mapping dispatch actions to the props
  const mapDispatchToProps = (dispatch) => ({
    dispatch: dispatch,
    startup: () => dispatch(StartupActions.startup())
  })
  
  // Maps the state in to props (for displaying on the front end)
  const mapStateToProps = (state) => ({
    nav: state.nav,
    user: state.user.user,
    artist: state.artist.artist,
    songs: state.songs.songs,
    inGameData: state.inGameData.inGameData
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(TheModal)