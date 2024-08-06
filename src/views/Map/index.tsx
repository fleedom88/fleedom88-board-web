import { useEffect, useRef, useState } from "react";
import { Map, MapMarker, useMap } from "react-kakao-maps-sdk";

declare global {
    interface Window {
      kakao: any;
    }
}

const {kakao} = window;

export default function KakaoKeywordMap(){
  const [map, setMap] = useState<any>();
  const [markers, setMarkers] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);

  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedPlace, setSelectedPlace] = useState();

  const markerImageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
  const imageSize = { width: 36, height: 37 };
  const spriteSize = { width: 36, height: 691 };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setKeyword(searchInput);
  };

  useEffect(()=>{
    if(!map) return;
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data:any,status:any,_pagination:any)=>{
      if(status === kakao.maps.services.Status.OK){
        setPlaces(data);

        const bounds = new kakao.maps.LatLngBounds();
        let markers = [];
        
        for (let i = 0; i < data.length; i++) {
          markers.push({
            position:{
              lat: data[i].y,
              lng: data[i].x,
            },
            content: data[i].place_name,
            }
            );
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
          }
          setMarkers(markers);

          // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
          map.setBounds(bounds);

        }
      })
    },[map,keyword]);

    const EventMarkerContainer = ({ position, content, i }: any) => {
      const map = useMap();
      const [isVisible, setIsVisible] = useState(false);
    
      return(
        <MapMarker
          position={position}
          image={{
            src: markerImageSrc,
            size: imageSize,
            options: {
              spriteSize: spriteSize,
              spriteOrigin: new kakao.maps.Point(0, i * 46 + 10),
              offset: new kakao.maps.Point(13, 37),
            },
          }}
          onClick={(marker) => {
            map.panTo(marker.getPosition());
            setSelectedPlace(places[i]);
          }}
          onMouseOver={() => setIsVisible(true)}
          onMouseOut={() => setIsVisible(false)}
        >
          {isVisible && <div style={{ color: '#000' }}>{content}</div>}
        </MapMarker>
      )
    
    };

    return(
      <div className='map_wrap'>
        <Map
        center={{
          lat: 37.566826,
          lng: 126.9786567,
        }}
        style={{
          width: '100%',
          height: '500px',
        }}
        level={3}
        onCreate={setMap}
        >
          {markers.map((marker, i) => (
          <EventMarkerContainer
            key={`EventMarkerContainer-${marker.position.lat}-${marker.position.lng}`}
            position={marker.position}
            content={marker.content}
            i={i}
          />
        ))}
        </Map>
        <div id="menu_wrap" className="bg_white">
        <div className="option">
          <div>
            <form onSubmit={handleSearchSubmit}>
              키워드 :{' '}
              <input
                type="text"
                value={searchInput}
                onChange={handleKeywordChange}
                id="keyword"
                size={15}
              />
              <button type="submit">검색하기</button>
            </form>
          </div>
        </div>
        <hr />
        <ul id="placesList">
          {places.map((item, i) => (
            <li
              key={i}
              className="item"
              onClick={() => {
                map.panTo(
                  new kakao.maps.LatLng(
                    markers[i].position.lat,
                    markers[i].position.lng
                  )
                );
                setSelectedPlace(item);
              }}
            >
              <span className={`markerbg marker_${i + 1}`}></span>
              <div className="info">
                <h5>{item.place_name}</h5>
                {item.road_address_name ? (
                  <>
                    <span>{item.road_address_name}</span>
                    <span className="jibun gray">{item.address_name}</span>
                  </>
                ) : (
                  <span>{item.address_name}</span>
                )}
                <span className="tel">{item.phone}</span>
              </div>
            </li>
          ))}
        </ul>
        <div id="pagination"></div>
      </div>
      </div>
    );

};

//          component: 키워드로 화면 컴포넌트             //
// export default function MapByKeyword() {

//     const Map = () => {
//         const [map,setMap] = useState(null);

//         useEffect(()=>{
//             const container = document.getElementById('map');
//             const options = { center: new kakao.maps.LatLng(33.450701, 126.570667) };
//             const kakaoMap = new kakao.maps.Map(container, options);
//             setMap(kakaoMap);

//         },[])

//         return (
//             <div
//                 style={{
//                     width: '100%',
//                     display: 'inline-block',
//                     marginLeft: '5px',
//                     marginRight: '5px',
//                 }}
//             >
//                 <div id="map" style={{ width: '99%', height: '500px' ,display:'none'}}></div>
//             </div>
//         );      
//     }
    

//     return (
//         <>
//         <Map/>
//         {/* <iframe width={'2000px'} height={'10000px'} src={'https://map.kakao.com/link/to/카카오판교오피스,37.402056,127.108212'}>
//             {'지도 오류입니다.'}
//         </iframe> */}
//         <div  style={{display:"none"}}>
//             <a href="https://map.kakao.com/?urlX=524450&urlY=1082263&urlLevel=3&map_type=TYPE_MAP&map_hybrid=false" target="_blank">
//                 <img width="504" height="310" src="https://map2.daum.net/map/mapservice?FORMAT=PNG&SCALE=2.5&MX=524450&MY=1082263&S=0&IW=504&IH=310&LANG=0&COORDSTM=WCONGNAMUL&logo=kakao_logo" style={{border:"1px"}}/>
//             </a>
//             <div className="hide">
//                 <strong  style={{float: "left"}}>
//                 <img src="//t1.daumcdn.net/localimg/localimages/07/2018/pc/common/logo_kakaomap.png" width="72" height="16" alt="카카오맵"/></strong>
//                 <div style={{float: "right", position: "relative"}}>
//                     <a className="a" target="_blank" href="https://map.kakao.com/?urlX=524450&urlY=1082263&urlLevel=3&map_type=TYPE_MAP&map_hybrid=false">지도 크게 보기</a>
//                 </div>
//             </div>
//         </div>
//         </>
//     )
// }