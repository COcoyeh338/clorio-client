import React from 'react'
import {Row,Col} from 'react-bootstrap'
import Button from './Button'

export default function SignMessageForm(props) {
  if(props.result){
    return renderResult()
  }

  return (
    <div className="mx-auto">
        <div className="block-container fit-content-container  ">
            <div className="transaction-form animate__animated animate__fadeIn ">
                <div className="mx-auto fit-content"><strong><h2>Sign message</h2></strong></div>
                <div className="v-spacer" />
                <Row>
                    <Col md={8} className="offset-md-2" >
                        <h3>Message</h3>
                        <div className="wrap-input1 validate-input" data-validate="Name is required">
                            <span className="icon" />
                            <input className="input1" type="text" name="message" value={props.message} placeholder="Message " onChange={(e)=>props.setMessage(e.currentTarget.value)} />
                            <span className="shadow-input1"></span>
                        </div>
                        <h3>Private key</h3>
                        <div className="wrap-input1 validate-input" data-validate="Name is required">
                            <span className="icon" />
                            <input className="input1" type="text" name="privateKey" value={props.privateKey} placeholder="Private key" onChange={(e)=>props.setPrivateKey(e.currentTarget.value)} />
                            <span className="shadow-input1"></span>
                        </div>
                        <div className="v-spacer" />
                        <Button 
                          className="lightGreenButton__fullMono mx-auto" 
                          onClick={props.submitHandler} 
                          disabled={props.disableButton()}
                          text="Sign" 
                          />
                    </Col>
                </Row>
            </div>
        </div>
    </div>
  )

  function renderResult(){
    return(
      <div className="mx-auto">
          <div className="block-container fit-content-container">
              <div className="transaction-form animate__animated animate__fadeIn ">
                  <div className="mx-auto fit-content"><strong><h2>Your signed message</h2></strong></div>
                  <div className="v-spacer" />
                  <Row>
                  <Col md={8} className="offset-md-2" >
                    <div className="signed-message-container my-auto">
                      <p>----- PUBLIC KEY -----</p>
                      <p>
                        {props.result.publicKey}
                      </p>
                      <p>----- FIELD -----</p>
                      <p>
                        {props.result.signature.field}
                      </p>
                      <p>----- SCALAR -----</p>
                      <p>
                        {props.result.signature.scalar}
                      </p>
                      <p>----- MESSAGE -----</p>
                      <p>
                      {props.result.payload}
                      </p>
                    </div>
                    <div className="v-spacer" />
                    <Button 
                      className="link-button inline-element" 
                      onClick={props.reset} 
                      text="Sign new message" 
                      />
                  </Col>
                </Row>
              </div>
          </div>
      </div>
    )
  }
}
