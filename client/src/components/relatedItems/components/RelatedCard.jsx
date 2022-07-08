import React from "react";
import $ from "jquery";
// import Stars from "react-stars-display";

class RelatedCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultOriginalPrice: 0,
      defaultSalePrice: 0,
      defaultPhoto: "",
    };
  }

  componentDidMount() {
    this.props.itemData.itemStyles.results.forEach((styleInfoObj) => {
      if (styleInfoObj["default?"]) {
        this.setState({
          defaultOriginalPrice: styleInfoObj.original_price,
          defaultSalePrice: styleInfoObj.sale_price,
          defaultPhoto: styleInfoObj.photos[0].url,
        });
      }
    });
  }

  render() {
    return (
      <div
        style={{
          border: "1px solid grey",
          padding: "15px 15px 15px 15px",
          margin: "15px 15px 15px 15px",
        }}
        onClick={() =>
          this.props.prodIDChanger(this.props.itemData.itemInfo.id)
        }
      >
        <div
          style={{
            height: "200px",
            width: "200px",
            marginBottom: "10px",
            backgroundImage: `url(${this.state.defaultPhoto})`,
            backgroundSize: "200px 200px",
          }}
        >
          <button
            style={{
              float: "right",
              background: "transparent",
              borderColor: "transparent",
            }}
            onClick={() => {
              this.props.comparison(
                this.props.itemData.itemInfo.features,
                this.props.itemData.itemInfo.name
              );
            }}
          >
            &#11088;
          </button>
        </div>

        <div>
          <div>{this.props.itemData.itemInfo.category}</div>
          <div>
            {" "}
            <b>{this.props.itemData.itemInfo.name}</b>
          </div>
          <div>
            {this.state.defaultSalePrice === null ? (
              `$${this.state.defaultOriginalPrice}`
            ) : (
              <span>
                <span style={{ color: "red" }}>
                  {" "}
                  ${this.state.defaultSalePrice}
                </span>{" "}
                <del> ${this.state.defaultOriginalPrice}</del>
              </span>
            )}
          </div>
          <div>
            star reviews here
            {/* <Stars stars={3.5} /> */}
          </div>
        </div>
      </div>
    );
  }
}

export default RelatedCard;
