
////////////////////////////////////////////////////////////////////////////////
//
//  Application module.
//
////////////////////////////////////////////////////////////////////////////////

import React from "react";
import Jumbotron from "react-bootstrap/lib/Jumbotron";
import jQuery from "jquery";
import Table from "./Table";
import Filters from "./Filters";
import Paper from 'material-ui/lib/paper';
import CircularProgress from 'material-ui/lib/circular-progress';


////////////////////////////////////////////////////////////////////////////////
//
//  Application class.
//
////////////////////////////////////////////////////////////////////////////////

class App extends React.Component
{
  constructor ( props )
  {
    // Call the base class's constructor.
    super ( props );

    // Private data members.
    this.state = {
      rows: [],
      source: null,
      title: null,
      filters: { controls: null, active: {} },
      columns: null,
      error: null
    };
    this._timeoutRender = null;

    // Start downloading the data.
    this._download();
  }

  render()
  {
    return this._render();
  }
}


////////////////////////////////////////////////////////////////////////////////
//
//  Start the download.
//
////////////////////////////////////////////////////////////////////////////////

App.prototype._download = function()
{
  // Use this to simulate long download.
  var delay = 0;

  setTimeout ( jQuery.proxy ( function()
  {
    jQuery.ajax ( {
      url: "/data/ncaa_d1_wrestling_all_americans.json",
      dataType: "json",
      success: jQuery.proxy ( this._onDownloadSuccess, this ),
      error: jQuery.proxy ( this._onDownloadError, this ),
    } );
  }, this ), delay );
}


////////////////////////////////////////////////////////////////////////////////
//
//  Called if the download succeeded.
//
////////////////////////////////////////////////////////////////////////////////

App.prototype._onDownloadSuccess = function ( data )
{
  // Set the new state and generate a render.
  this.state.filters.controls = data.filters;
  this.setState ( {
    rows: data.rows,
    source: data.source,
    title: data.title,
    columns: data.columns } );
};


////////////////////////////////////////////////////////////////////////////////
//
//  Called if the download failed.
//
////////////////////////////////////////////////////////////////////////////////

App.prototype._onDownloadError = function ( error )
{
  this.setState ( { error: error.statusCode() } );
};


////////////////////////////////////////////////////////////////////////////////
//
//  Called when a filter changed.
//
////////////////////////////////////////////////////////////////////////////////

App.prototype._onNumericFilterChanged = function ( event )
{
  var column = event.column;
  var operation = event.operation;
  var value = event.value;
  var filters = this.state.filters.active;

  if ( value.length <= 0 )
  {
    delete filters[column][operation];
  }

  else
  {
    if ( !filters[column] )
    {
      filters[column] = {};
    }
    filters[column][operation] = 1 * value;
  }

  // Generate a render.
  this.requestRender();
};


////////////////////////////////////////////////////////////////////////////////
//
//  Called when a filter changed.
//
////////////////////////////////////////////////////////////////////////////////

App.prototype._onTextFilterChanged = function ( event )
{
  var column = event.column;
  var operation = "contains";
  var value = event.value;
  var filters = this.state.filters.active;

  if ( value.length <= 0 )
  {
    delete filters[column][operation];
  }

  else
  {
    if ( !filters[column] )
    {
      filters[column] = {};
    }
    filters[column][operation] = value;
  }

  // Generate a render.
  this.requestRender();
};


////////////////////////////////////////////////////////////////////////////////
//
//  Request a render.
//
////////////////////////////////////////////////////////////////////////////////

App.prototype.requestRender = function()
{
  if ( this._timeoutRender )
  {
    clearTimeout ( this._timeoutRender );
  }

  this._timeoutRender = setTimeout ( jQuery.proxy ( function()
  {
    this._timeoutRender = null;
    this.setState ( { filters: this.state.filters } );
  }, this ), 500 );
};


////////////////////////////////////////////////////////////////////////////////
//
//  Render.
//
////////////////////////////////////////////////////////////////////////////////

App.prototype._render = function()
{
  var error = this.state.error;
  if ( error )
  {
    return this._renderError();
  }
  else
  {
    if ( this.state.rows.length )
    {
      return this._renderData();
    }
    else
    {
      return this._renderDownloading();
    }
  }
};


////////////////////////////////////////////////////////////////////////////////
//
//  Render the data.
//
////////////////////////////////////////////////////////////////////////////////

App.prototype._renderDownloading = function()
{
  return (
    <div className="outerContainerDiv">
      <center>
        <p>Loading...</p>
        <div><CircularProgress mode="indeterminate" /></div>
      </center>
    </div>
  );
};


////////////////////////////////////////////////////////////////////////////////
//
//  Render.
//
////////////////////////////////////////////////////////////////////////////////

App.prototype._renderError = function()
{
  var error = this.state.error;
  return (
    <div className="outerContainerDiv">
      <b>Error Downloading Data</b>
      <div>{error.responseText}</div>
      <div>{error.statusText}</div>
    </div>
  );
};


////////////////////////////////////////////////////////////////////////////////
//
//  Render the data.
//
////////////////////////////////////////////////////////////////////////////////

App.prototype._renderData = function()
{
  return (
    <div className="outerContainerDiv">
      <Paper zDepth={2}>
        <Jumbotron>
          <center>
            <h2>{this.state.title}</h2>
            <p>An alternative view to the data found <a target="_blank" href={this.state.source}>here</a>.</p>
          </center>
        </Jumbotron>
      </Paper>
      <Filters
        filters={this.state.filters.controls}
        onNumericFilterChanged={ jQuery.proxy ( this._onNumericFilterChanged, this ) }
        onTextFilterChanged={ jQuery.proxy ( this._onTextFilterChanged, this ) } />
      <Paper zDepth={2}>
        <Table
          rows={this.state.rows}
          columns={this.state.columns}
          filters={this.state.filters.active} />
      </Paper>
    </div>
  );
};


////////////////////////////////////////////////////////////////////////////////
//
//  The end of the module.
//
////////////////////////////////////////////////////////////////////////////////

export default App;
