"use strict"

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var $ = require('jquery');

var PokemonActions = require('../actions/PokemonActions.jsx');

var Navigation = Router.Navigation;
var State = Router.State;


var Reflux = require('reflux');
var PokemonStore = require('../stores/PokemonStores.jsx');



var Loading = React.createClass({
 
  render : function(){
    return (
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    )
  }
})


var PokemonSearch = React.createClass({
    mixins : [Navigation,
              State,
              Reflux.ListenerMixin
            ],

    getInitialState : function(){
      return {
        pokemonId : "",
        search : this.getParams().id || "",
        loading : false,
      };
    },

    componentDidMount : function(){
      this.listenTo(PokemonStore, this.navigate);
    },

    render : function(){
      var template;
        if(!this.state.loading){
          template = 
          <form onSubmit={this.searchPokemon} className="PokemonSearch">
            <input 
              type="text" 
              placeholder="Name or ID of the Pokemon"
              value={this.state.pokemonId}
              onChange={this.onChange}
              className="PokemonSearch-input"
              autoFocus
              />
              <button 
              type="submit"
              className="PokemonSearch-submit"
              >Search...</button>
          </form>
        }else{
          template = <Loading/>
        }
        return(
          <div>
            {template}
          </div>
        );
    },
    onChange : function(e){
      this.setState({
        pokemonId : e.target.value,
      });
    },
    searchPokemon: function(e) {
      e.preventDefault();

      if(this.state.search !== this.state.pokemonId){
        this.setState({
          search : this.state.pokemonId,
          loading : true,
        })
        $.ajax({
            headers: { 
                Accept : "application/json; charset=utf-8"
            },
            url :'/pokemon/'+this.state.pokemonId,
            method : "GET",
            contentType : "application/json"
            })
        .done(function(pokemon){
          this.setState({loading:false});
            PokemonActions.changePokemon(pokemon);
        }.bind(this));
      }else{
        console.warn('Intenta buscar otro pokemon :)');
      }
    },
    navigate : function(){
        this.transitionTo('pokemon', {id: this.state.pokemonId});
    },


});

module.exports = PokemonSearch;


