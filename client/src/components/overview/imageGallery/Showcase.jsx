import React from 'react';
import styled from 'styled-components';
import RenderZoom from './RenderZoom.jsx';

const IMG = styled.img`
  margin: 5px;
  border-radius: 35%;
  height: 70px;
  width: 70px;
  object-fit: cover;
  cursor: pointer;
`;

const MainIMG = styled.img`
  border: 1px solid;
  border-radius: 15%;
  height: 720px;
  width: 620px;
  object-fit: cover;
  object-position: center;
  z-index: 1;
  cursor: pointer;
`;

const Div = styled.div`
  background: rgba(0,0,0,0.75);
  margin: -96px -8px;
  height: 100%;
  width: 100%;
  position: fixed;
  z-index: 10;
  display: flex;
  justify-content: center;
  backdrop-filter: blur(8px) contrast(70%);
`;

const Big = styled.img`
  border: 1px solid;
  border-radius: 15%;
  height: 852px;
  width: 852px;
  object-fit: cover;
  margin-top: 20px;
  cursor: zoom-in;
`;

const Thumbnails = styled.div`
  position: absolute;
  display: flex;
  top: 70px;
  left: 30px;
  z-index: 2;
  padding-left: 20px;
`;

const EnlargedThumbnails = styled.div`
  position: absolute;
  display: flex;
  top: 70px;
  left: 400px;
  z-index: 2;
  padding-left: 20px;
`;

class Showcase extends React.Component {
  constructor(props) {
    super(props);
    const { photos } = props;
    this.state = {
      photos,
      currPhoto: photos[0],
      picList: [],
      modalSeen: false,
      count: 0,
      min: 0,
      max: 7,
      zoomIn: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.changePhoto = this.changePhoto.bind(this);
    this.handleArrowClick = this.handleArrowClick.bind(this);
    this.sliceThumbnails = this.sliceThumbnails.bind(this);
    this.updateCount = this.updateCount.bind(this);
    this.nextThumbnails = this.nextThumbnails.bind(this);
    this.previousThumbnails = this.previousThumbnails.bind(this);
    this.expand = this.expand.bind(this);
    this.renderZoom = this.renderZoom.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
  }

  componentDidMount() {
    this.sliceThumbnails();
  }

  componentDidUpdate() {
    if (this.state.photos !== this.props.photos) {
      this.setState({
        photos: this.props.photos,
        currPhoto: this.props.photos[0],
        count: 0,
        min: 0,
        max: 7
      });
    }
  }

  changePhoto(num) {
    const { photos } = this.state;
    this.setState(
      {
        currPhoto:
          photos[
            (photos.indexOf(this.state.currPhoto) + num + photos.length) %
              photos.length
          ],
      },
      () => this.updateCount()
    );
  }

  updateCount() {
    const { photos } = this.state;
    this.setState(
      {
        count: photos.indexOf(this.state.currPhoto),
      },
      () => {
        if (this.state.count === this.state.max) {
          this.nextThumbnails();
        }
        if (this.state.count === this.state.min - 1) {
          this.previousThumbnails();
        }
      }
    );
  }

  nextThumbnails() {
    this.setState({
      min: this.state.min + 7,
      max: this.state.max + 7,
    });
  }

  previousThumbnails() {
    this.setState({
      min: this.state.min - 7,
      max: this.state.max - 7,
    });
  }

  handleArrowClick(direction) {
    if (direction === 'right') {
      return (
        this.state.currPhoto.url !==
        this.state.photos[this.state.photos.length - 1].url
      );
    }
    if (direction === 'left') {
      return this.state.currPhoto.url !== this.state.photos[0].url;
    }
    if (direction === 'up') {
      return this.state.min !== 0;
    }
    if (direction === 'down') {
      return this.state.max < this.state.photos.length;
    }
    return false;
  }

  handleClick(link) {
    this.setState({
      currPhoto: this.state.photos.find((pic) => pic.url === link),
    });
  }

  sliceThumbnails(min, max) {
    const { photos } = this.state;
    var setOfPhotos = photos.slice(min, max);
    var style;
    return setOfPhotos.map((pic, i) => {
      if (pic.thumbnail_url === this.state.currPhoto.thumbnail_url) {
        style = {border: '3px solid rgba(39, 200, 210, 0.9)'};
      } else {
        style = {border: 'none'};
      }
      return (
        <IMG
          style={style}
          key={pic.url}
          src={pic.thumbnail_url}
          onClick={() => this.handleClick(pic.url)}
          alt={pic.url}
        />
      );
    });
  }

  expand() {
    this.setState({ modalSeen: !this.state.modalSeen });
    console.log('WE EXPANDERINO!');
  }

  handleZoom() {
    this.setState({ zoomIn: !this.state.zoomIn });
  }

  renderZoom() {
    if (this.state.zoomIn) {
      console.log('we are trying to zoomin');
      var container = document.getElementById('bigImageContainer');
      var picture = document.getElementById('bigImage');
      return (
        <RenderZoom
          picture={picture}
          container={container}
          zoomOut={this.handleZoom}
        />
      );
      return null;
    }
  }

  render() {
    if (this.state.zoomIn) {
      return (
        <Div id='bigImageContainer'>
          {this.renderZoom()}
        </Div>
      );
    }
    if (this.state.modalSeen) {
      return (
        <Div id='bigImageContainer'>
          {this.renderZoom()}
          <Big
            id='bigImage'
            src={this.state.currPhoto.url}
            alt={this.state.currPhoto.url}
            onClick={() => this.handleZoom()}
          />
          <i
            style={{cursor: 'pointer', position: 'absolute', color: 'white', top: '70px', right: '400px'}}
            className="fa-solid fa-xmark fa-xl"
            onClick={() => this.expand()}
          />
          {this.handleArrowClick('left') && (
            <i
              style={{cursor: 'pointer', position: 'absolute', color: 'rgba(39, 200, 210, 0.9)', bottom: '15%', left: '400px'}}
              onClick={() => this.changePhoto(-1)}
              className='fa fa-arrow-left fa-xl'
            />
          )}
          {this.handleArrowClick('right') && (
            <i
              style={{cursor: 'pointer', position: 'absolute', color: 'rgba(39, 200, 210, 0.9)', bottom: '15%', right: '400px'}}
              onClick={() => this.changePhoto(1)}
              className='fa fa-arrow-right fa-xl'
            />
          )}
          <EnlargedThumbnails style={{flexDirection: 'column'}}>
            {this.handleArrowClick('up') && (
              <i
                style={{cursor: 'pointer', color: 'white', filter: 'drop-shadow(0 0 0.4rem black)'}}
                onClick={() => this.previousThumbnails()}
                className='fa fa-angle-up fa-xl'
              />
            )}
            {this.sliceThumbnails(this.state.min, this.state.max)}
            {this.handleArrowClick('down') && (
              <i
                style={{cursor: 'pointer', color: 'white', filter: 'drop-shadow(0 0 0.4rem black)'}}
                onClick={() => this.nextThumbnails()}
                className='fa fa-angle-down fa-xl'
              />
            )}
          </EnlargedThumbnails>
        </Div>
      );
    }
    return (
      <div style={{position: 'relative'}}>
        {this.handleArrowClick('left') && (
          <i
            style={{cursor: 'pointer', position: 'absolute', color: 'rgba(39, 200, 210, 0.9)', bottom: '15%', left: '50px'}}
            onClick={() => this.changePhoto(-1)}
            className='fa fa-arrow-left fa-xl'
          />
        )}
        {this.handleArrowClick('right') && (
          <i
            style={{cursor: 'pointer', position: 'absolute', color: 'rgba(39, 200, 210, 0.9)', bottom: '15%', right: '50px'}}
            onClick={() => this.changePhoto(1)}
            className='fa fa-arrow-right fa-xl'
          />
        )}
        <MainIMG
          src={this.state.currPhoto.url}
          alt={this.state.currPhoto.url}
          onClick={() => this.expand()}
        />
        <Thumbnails style={{flexDirection: 'column'}}>
          {this.handleArrowClick('up') && (
            <i
              style={{cursor: 'pointer', color: 'white', filter: 'drop-shadow(0 0 0.4rem black)'}}
              onClick={() => this.previousThumbnails()}
              className='fa fa-angle-up fa-xl'
            />
          )}
          {this.sliceThumbnails(this.state.min, this.state.max)}
          {this.handleArrowClick('down') && (
            <i
              style={{cursor: 'pointer', color: 'white', filter: 'drop-shadow(0 0 0.4rem black)'}}
              onClick={() => this.nextThumbnails()}
              className='fa fa-angle-down fa-xl'
            />
          )}
        </Thumbnails>
      </div>
    );
  }
}

export default Showcase;
