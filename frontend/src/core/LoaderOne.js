import React from 'react'

const LoaderOne = ({waitingMessage="Wait for it...", noResult=false, noResultMessage}) => {

const failMessage = noResultMessage ? noResultMessage : "Sorry. We got nothin."

{return noResult ? (
  <div className="col-12 mt-4 mb-4" style={{textAlign: 'center'}}>
    <h3>{failMessage}</h3>
  </div>
):(
  <div className='col-12 mt-4 mb-4'>
      <div className='d-flex justify-content-center'>
        <div className="spinner-grow mr-2 mb-4 text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <div className="spinner-grow mr-2 mb-4 text-secondary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <div className="spinner-grow mr-2 mb-4 text-success" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <div className="spinner-grow mr-2 mb-4 text-danger" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <div className="spinner-grow mr-2 mb-4 text-warning" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <div className="spinner-grow mr-2 mb-4 text-info" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>        
      <div className='d-flex justify-content-center mt-4'>
      <h4>{waitingMessage}</h4>
      </div>
    </div>
  )}
}

export default LoaderOne
