
////////////////////////////////////////////////////////////////////////////////
//
//  Table module.
//
////////////////////////////////////////////////////////////////////////////////

import React from "react";
import Table from "react-bootstrap/lib/Table";
import jQuery from "jquery";


////////////////////////////////////////////////////////////////////////////////
//
//  Table class.
//
////////////////////////////////////////////////////////////////////////////////

class Component extends React.Component
{
  constructor ( props )
  {
    // Call the base class"s constructor.
    super ( props );
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
  return (
    <Table striped bordered condensed hover>
      <thead>
        <tr>{ this.props.columns.map ( this._renderColumnName ) }</tr>
      </thead>
      <tbody>
        { this.props.rows.map ( jQuery.proxy ( this._renderRow, this ) ) }
      </tbody>
    </Table>
  );
};


////////////////////////////////////////////////////////////////////////////////
//
//  Render a row.
//
////////////////////////////////////////////////////////////////////////////////

Component.prototype._renderRow = function ( row, index )
{
  var filters = this.props.filters;

  var numColumns = row.length;
  for ( let i = 0; i < numColumns; ++i )
  {
    let filter = filters[i];
    // console.log ( "filters:", filters );
    if ( filter )
    {
      for ( let operation in filter )
      {
        let filterValue = filter[operation];
        if ( null !== filterValue )
        {
          let rowValue = row[i];
          if ( null === rowValue )
          {
            return null;
          }

          switch ( operation )
          {
            case ">":
            {
              if ( row[i] > filterValue )
              {
                return null;
              }
              break;
            }
            case "<":
            {
              if ( row[i] < filterValue )
              {
                return null;
              }
              break;
            }
            case "contains":
            {
              if ( -1 === row[i].toLowerCase().indexOf ( filterValue.toLowerCase() ) )
              {
                return null;
              }
              break;
            }
          }
        }
      }

    }
  }

  // If we get to here then render the row.
  return ( <tr key={index}>{ row.map ( this._renderCell ) }</tr> );
};


////////////////////////////////////////////////////////////////////////////////
//
//  Render a cell.
//
////////////////////////////////////////////////////////////////////////////////

Component.prototype._renderCell = function ( value, index )
{
  return ( <td key={index}>{value}</td> );
};


////////////////////////////////////////////////////////////////////////////////
//
//  Render.
//
////////////////////////////////////////////////////////////////////////////////

Component.prototype._renderColumnName = function ( value, index )
{
  return ( <th key={index}><b>{value}</b></th> );
};


////////////////////////////////////////////////////////////////////////////////
//
//  The end of the module.
//
////////////////////////////////////////////////////////////////////////////////

export default Component;
