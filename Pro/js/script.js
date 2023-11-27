function calculateMileage() {
    // 사용자 입력 가져오기
    var startAddress = document.getElementById("startAddress").value;
    var endAddress = document.getElementById("endAddress").value;

    // 주소를 위도, 경도로 변환하는 API 호출
    convertAddressToLatLng(startAddress, function(startLat, startLon) {
        convertAddressToLatLng(endAddress, function(endLat, endLon) {
            // 거리 측정 API 호출
            var distance = getDistance(startLat, startLon, endLat, endLon);

            // 마일리지 계산
            var mileage = calculateMileageFromDistance(distance);

            // 결과 출력
            document.getElementById("result").innerHTML = "이용거리: " + distance + "km<br>적립된 마일리지: " + mileage + "포인트";
        });
    });
}

function convertAddressToLatLng(address, callback) {
    var url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;
    var headers = {'Authorization': 'ec9fb865ecc96649854fe4493916d802'};

    // 주소를 위도, 경도로 변환하는 API 호출
    fetch(url, {headers: headers})
        .then(response => response.json())
        .then(data => {
            var firstResult = data.documents[0];
            var lat = firstResult.y;
            var lon = firstResult.x;
            callback(lat, lon);
        })
        .catch(error => {
            console.error('Error converting address to LatLng:', error);
            callback(null, null); // 변환 실패 시에는 null을 전달하거나 다른 방식으로 처리
        });
}

function getDistance(startLat, startLon, endLat, endLon) {
    var url = `https://dapi.kakao.com/v2/local/search/route.json?startX=${startLon}&startY=${startLat}&endX=${endLon}&endY=${endLat}`;
    var headers = {'Authorization': 'ec9fb865ecc96649854fe4493916d802'};

    // 거리 측정 API 호출
    return fetch(url, {headers: headers})
        .then(response => response.json())
        .then(data => {
            var distance = data.documents[0].distance; // 거리 값은 미터 단위
            return distance / 1000; // 미터를 킬로미터로 변환
        })
        .catch(error => {
            console.error('Error getting distance:', error);
            return null; // 에러 발생 시에는 null을 반환하거나 다른 방식으로 처리
        });
}

function calculateMileageFromDistance(distance) {
    // 마일리지 계산 로직
    if (distance !== null) {
        return distance * 100; // 임시 값: 거리당 100포인트
    } else {
        return 0; // 거리 측정 에러 또는 거리가 null인 경우 0으로 처리
    }
}

