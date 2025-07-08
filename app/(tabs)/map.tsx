import MapsBottomSheet, {
  MapsBottomSheetHandle,
} from "@/components/MapsBottomSheet";
import PokemonBottomSheet, {
  PokemonBottomSheetHandle,
} from "@/components/PokemonModal";
import { PokemonCardData } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, ImageRef } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import { AppleMaps, GoogleMaps } from "expo-maps";
import React, { useEffect, useRef } from "react";
import { Platform, Text } from "react-native";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type MarkerData = {
  id: string;
  coordinates: Coordinates | null;
  title: string;
  image: ImageRef;
  PokemonData: PokemonCardData;
};

const EARTH_RADIUS = 6_371_000;
const EARTH_CIRC_PER_TILE = 156543.03392;
const toRad = (deg: number) => (deg * Math.PI) / 180;
const initialZoom = 12;

function distanceMeters(a: Coordinates, b: Coordinates): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);

  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(h));
}

function tapToleranceMeters(
  zoom: number,
  latitude: number,
  radiusPx = 20
): number {
  const metersPerPixel =
    (EARTH_CIRC_PER_TILE * Math.cos((latitude * Math.PI) / 180)) / 2 ** zoom;

  return radiusPx * metersPerPixel;
}

export function getClickedMarker(
  click: Coordinates,
  markers: MarkerData[],
  toleranceMeters = 200
): MarkerData | null {
  return (
    markers.find(
      (m) =>
        m.coordinates && distanceMeters(click, m.coordinates) <= toleranceMeters
    ) || null
  );
}

export default function map() {
  const bottomSheetRef = useRef<MapsBottomSheetHandle>(null);
  const pokemonBottomSheetRef = useRef<PokemonBottomSheetHandle>(null);
  const [mapClick, setMapClick] = React.useState<Coordinates | null>(null);
  const [markers, setMarkers] = React.useState<MarkerData[]>([]);
  const zoomRef = useRef(initialZoom);

  useEffect(() => {
    (async () => {
      const storedMarkers = await AsyncStorage.getItem("@pokemonsOnMap");
      if (storedMarkers) {
        const parsedMarkers: MarkerData[] = JSON.parse(storedMarkers);
        for (const marker of parsedMarkers) {
          let image: ImageRef;
          if (Platform.OS === "android") {
            const result = await ImageManipulator.manipulateAsync(
              marker.PokemonData.image,
              [{ resize: { width: 128, height: 128 } }],
              {
                format: ImageManipulator.SaveFormat.PNG,
                compress: 1,
                base64: false,
              }
            );
            image = await Image.loadAsync(result.uri);
          } else {
            image = await Image.loadAsync(marker.PokemonData.image);
          }
          marker.image = image;
        }
        console.log("Markers loaded:", parsedMarkers);
        setMarkers(parsedMarkers);
      }
    })();
  }, []);

  const handleMarkerClick = (e: any) => {
    if (pokemonBottomSheetRef.current) {
      const pokemon = markers.find((m) => m.id === e.id);
      if (!pokemon) return;
      pokemonBottomSheetRef.current.open(pokemon.PokemonData, false);
    }
    return;
  };
  const handleMapClick = (e: any) => {
    const clickedMarker = getClickedMarker(
      e,
      markers,
      tapToleranceMeters(zoomRef.current, e.latitude)
    );
    console.log("a");
    if (clickedMarker !== null && clickedMarker.coordinates !== null) {
      if (pokemonBottomSheetRef.current) {
        console.log("Clicked marker:", clickedMarker);
        const pokemonId = clickedMarker.id.split("+")[1];
        const pokemon = markers.find((m) => m.id === clickedMarker.id);
        pokemonBottomSheetRef.current.open(clickedMarker.PokemonData, false);
      }
      return;
    }
    if (bottomSheetRef.current) {
      bottomSheetRef.current.open();
    }
    const { latitude, longitude } = e;
    setMapClick({
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
    });
  };

  const moveCamera = (e: any) => {
    zoomRef.current = e.zoom;
  };

  const createMarker = async (PokemonCardData: PokemonCardData) => {
    let image: ImageRef;
    if (Platform.OS === "android") {
      const result = await ImageManipulator.manipulateAsync(
        PokemonCardData.image,
        [{ resize: { width: 128, height: 128 } }],
        {
          format: ImageManipulator.SaveFormat.PNG,
          compress: 1,
          base64: false,
        }
      );
      image = await Image.loadAsync(result.uri);
    } else {
      image = await Image.loadAsync(PokemonCardData.image);
    }
    const marker: MarkerData = {
      id: `${markers.length + 1}+${PokemonCardData.id}`,
      coordinates: mapClick,
      title: PokemonCardData.name,
      image: image,
      PokemonData: PokemonCardData,
    };
    const newMarkers = [...markers, marker];
    setMarkers((prevMarkers) => [...prevMarkers, marker]);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
    try {
      await AsyncStorage.setItem("@pokemonsOnMap", JSON.stringify(newMarkers));
      console.log("Markers saved:", newMarkers);
    } catch (error) {
      console.error("Markers not saved:", error);
    }
  };

  if (Platform.OS === "ios") {
    return (
      <>
        <AppleMaps.View
          style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
          cameraPosition={{
            coordinates: {
              latitude: 50.049683,
              longitude: 19.944544,
            },
            zoom: initialZoom,
          }}
          onCameraMove={moveCamera}
          annotations={markers
            .filter((marker) => marker.coordinates !== null)
            .map((marker) => ({
              coordinates: marker.coordinates!,
              icon: marker.image,
              title: marker.title,
            }))}
          markers={markers
            .filter((marker) => marker.coordinates !== null)
            .map((marker) => ({
              id: marker.id.toString(),
              coordinates: marker.coordinates!,
              tintColor: "#00000000",
            }))}
          properties={{
            isTrafficEnabled: false,
            mapType: AppleMaps.MapType.STANDARD,
            selectionEnabled: false,
          }}
          onMapClick={handleMapClick}
        />
        <MapsBottomSheet ref={bottomSheetRef} createMarker={createMarker} />
        <PokemonBottomSheet ref={pokemonBottomSheetRef} />
      </>
    );
  } else if (Platform.OS === "android") {
    return (
      <>
        <GoogleMaps.View
          style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
          cameraPosition={{
            coordinates: {
              latitude: 50.049683,
              longitude: 19.944544,
            },
            zoom: initialZoom,
          }}
          markers={markers
            .filter((marker) => marker.coordinates !== null)
            .map((marker) => ({
              id: marker.id.toString(),
              coordinates: marker.coordinates!,
              icon: marker.image,
              title: marker.title,
              draggable: false,
              showCallout: false,
            }))}
          onMapClick={handleMapClick}
          properties={{ isTrafficEnabled: false, selectionEnabled: false }}
          onCameraMove={moveCamera}
          onMarkerClick={handleMarkerClick}
        />
        <MapsBottomSheet ref={bottomSheetRef} createMarker={createMarker} />
        <PokemonBottomSheet ref={pokemonBottomSheetRef} />
      </>
    );
  } else {
    return <Text>Maps are only available on Android and iOS</Text>;
  }
}
