import React, { Component } from 'react';
import './QuoteBox.css';

/*
 * Random Quote Generation with React
 */
class QuoteBox extends React.Component {
  constructor(props) {
        super(props);
        
    this.state = {
        quotes: [],
        quote: '',
        author: '',
        backgroundColor: ''
        };
    this.setQuote = this.setQuote.bind(this);
  }
  
  updateBackground() {
    // get random number.
    const colors = [0,0,0].map(x => x + Math.floor(Math.random() * 200)); 
    let color = 'rgb(' + colors[0] + ',' + colors[1]+ ',' + colors[2] + ')';
    this.setState (
      {
        backgroundColor: color,
      }
    );
  }
  
  loadQuotes() {
    const quotes = [];
   fetch("https://en.wikiquote.org/w/api.php?    &origin=*&action=parse&page=Wikiquote:Quote%20of%20the%20Day&format=json", 
    {
      method: 'GET',
    }
     )
      .then(response => response.json())
      .then(data => { //use arrow function to preserve 'this'
        var text = data["parse"]["text"];
        var list = JSON.stringify(text).split('<li>');
        var author = '';
        var quote =  '';
        for (let i = 1; i < list.length-1; i++) {
          quote = list[i].substring(0, list[i].indexOf('~')-1);
          author = list[i].substring(list[i].indexOf('\">')+2, list[i].indexOf('</a'));
          quotes.push({author: author, quote: quote});
        }
        this.setState({
          quotes: quotes,
        })
        this.setQuote();
    });
    }
  
  setQuote() {
    let x = Math.floor(Math.random() * (this.state.quotes.length - 1));
		this.setState(
            {
              quote: this.state.quotes[x].quote.replace(/<(?:.|\n)*?>|"|\/|<br/gm, ''),
              author: this.state.quotes[x].author
            }
        );
    this.updateBackground();
	};

  componentDidMount() {
    this.loadQuotes();
  }
  
  render() {
    return <div id="quote-box" style = {{backgroundColor: this.state.backgroundColor}}>
      <h2 id="text">"{this.state.quote}"</h2>
            <p id="author">-{this.state.author}</p>
      <div>
        <button id="new-quote" onClick={ this.setQuote }>
				      New Quote
			      </button>
        <a id="tweet-quote" href={"https://twitter.com/intent/tweet?text=" + '"' + this.state.quote + '"  - ' + this.state.author} target="_blank">Tweet Quote</a>
      </div>
    </div>;
  }
}

export default QuoteBox;