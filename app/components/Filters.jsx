
////////////////////////////////////////////////////////////////////////////////
//
//  Filters module.
//
////////////////////////////////////////////////////////////////////////////////

import React from "react";
import Button from "react-bootstrap/lib/Button";
import Panel from "react-bootstrap/lib/Panel";
import Grid from "react-bootstrap/lib/Grid";
import Row from "react-bootstrap/lib/Row";
import Col from "react-bootstrap/lib/Col";
import jQuery from "jquery";


////////////////////////////////////////////////////////////////////////////////
//
//  Filters class.
//
////////////////////////////////////////////////////////////////////////////////

class Component extends React.Component
{
  constructor ( props )
  {
    // Call the base class"s constructor.
    super ( props );

    this.state = {
      open: false,
      handlers: {
        number: this._renderNumericSpinnerFilter,
        text: this._renderTextFilter
      }
    };
  }

  render()
  {
    return this._render();
  }
}


////////////////////////////////////////////////////////////////////////////////
//
//  Render.
//
////////////////////////////////////////////////////////////////////////////////

Component.prototype._render = function()
{
  var props = this.props;

  var filters = props.filters;
  if ( ( !filters ) || ( filters.length <= 0 ) )
  {
    return null;
  }

  return (
    <div className="filtersContainer">
      <Button onClick={ ()=> this.setState({ open: !this.state.open })}>
        { ( this.state.open ) ? "Hide Filters" : "Show Filters" }
      </Button>
      <Panel collapsible expanded={this.state.open}>
        <Grid>
          <Row className="show-grid">
            { props.filters.map ( jQuery.proxy ( this._renderGroup, this ) ) }
          </Row>
        </Grid>
      </Panel>
    </div>
  );
};


////////////////////////////////////////////////////////////////////////////////
//
//  Render the filter group.
//
////////////////////////////////////////////////////////////////////////////////

Component.prototype._renderGroup = function ( group, index )
{
  return (
    <Col xs={12} md={6} lg={3} key={index}>
      <div className="filterGroupDiv">
        { group.map ( jQuery.proxy ( this._renderFilter, this ) ) }
      </div>
    </Col>
  );
};


////////////////////////////////////////////////////////////////////////////////
//
//  Render the filter control.
//
////////////////////////////////////////////////////////////////////////////////

Component.prototype._renderFilter = function ( filter, index )
{
  var type = filter.type;
  var handler = this.state.handlers[type];
  if ( !handler )
  {
    return <div>Unknown filter filter type: {type}</div>;
  }

  return handler.call ( this, filter, index );
};


////////////////////////////////////////////////////////////////////////////////
//
//  Render the number filter control.
//
////////////////////////////////////////////////////////////////////////////////

Component.prototype._renderNumericSpinnerFilter = function ( filter, index )
{
  var onFilterChanged = this.props.onNumericFilterChanged;
  var operation = filter.operation;
  var columns = filter.columns;
  var numColumns = columns.length;

  var localValueChangedCallback = function ( event )
  {
    if ( onFilterChanged )
    {
      for ( let i = 0; i < numColumns; ++i )
      {
        let column = columns[i];
        let value = event.target.value;
        onFilterChanged ( { column: column, operation: operation, value: value } );
      }
    }
  };

  return (
    <div key={index}>
      <span className="numericSpinnerFilterLabel">{filter.label}</span>
      <input
        className="numericSpinnerFilterInput"
        type={"number"}
        onChange={ jQuery.proxy ( localValueChangedCallback, this ) } />
    </div>
  );
};


////////////////////////////////////////////////////////////////////////////////
//
//  Render the text filter control.
//
////////////////////////////////////////////////////////////////////////////////

Component.prototype._renderTextFilter = function ( filter, index )
{
  var onFilterChanged = this.props.onTextFilterChanged;
  var columns = filter.columns;
  var numColumns = columns.length;

  var localValueChangedCallback = function ( event )
  {
    if ( onFilterChanged )
    {
      for ( let i = 0; i < numColumns; ++i )
      {
        let column = columns[i];
        let value = event.target.value;
        onFilterChanged ( { column: column, value: value } );
      }
    }
  };

  return (
    <div key={index}>
      <span className="textFilterLabel">{filter.label}</span>
      <input
        className="textFilterInput"
        type={"text"}
        onChange={ jQuery.proxy ( localValueChangedCallback, this ) } />
    </div>
  );
};


////////////////////////////////////////////////////////////////////////////////
//
//  The end of the module.
//
////////////////////////////////////////////////////////////////////////////////

export default Component;
