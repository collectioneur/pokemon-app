import PokemonCard from "@/components/PokemonCard";
import { PokemonCardData } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { FlatList as FL } from "react-native-gesture-handler";

interface CameraCarouselProps {
  chooseImage: (uri: string) => void;
}

const PAGE_SIZE = 20;

const CameraCarousel: React.FC<CameraCarouselProps> = ({ chooseImage }) => {
  const [loading, setLoading] = useState(false);
  const [pokemons, setPokemons] = useState<PokemonCardData[]>([]);
  const isFetching = useRef(false);
  const offset = useRef(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPage();
  }, []);

  const fetchPage = async () => {
    if (isFetching.current || !hasMore) return;
    setLoading(true);
    isFetching.current = true;
    try {
      const listRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset.current}`
      );
      const listJson = await listRes.json();
      const pageData: PokemonCardData[] = await Promise.all(
        listJson.results.map(async (p: { url: string; name: string }) => {
          const detail = await fetch(p.url).then((r) => r.json());
          const id = String(detail.id);
          return {
            id,
            name: detail.name,
            image:
              detail.sprites.other["official-artwork"].front_default ||
              detail.sprites.front_default,
            types: detail.types.map((t: any) => t.type.name),
            stats: {
              hp: detail.stats[0].base_stat,
              attack: detail.stats[1].base_stat,
              defense: detail.stats[2].base_stat,
              speed: detail.stats[5].base_stat,
              specialAttack: detail.stats[3].base_stat,
              specialDefense: detail.stats[4].base_stat,
            },
          };
        })
      );

      setPokemons((prev) => [...prev, ...pageData]);
      offset.current += PAGE_SIZE;
      setHasMore(Boolean(listJson.next));
      isFetching.current = false;
    } catch (err) {
      console.error("Failed to fetch Pokémon page", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FL
      className=""
      data={pokemons}
      horizontal={true}
      renderItem={({ item }) => (
        <View style={{ width: 150, height: 170 }}>
          <PokemonCard
            item={item}
            onPress={() => {
              chooseImage(item.image);
            }}
          />
        </View>
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        paddingHorizontal: 0,
        paddingBottom: 12,
      }}
      onEndReached={fetchPage}
      onEndReachedThreshold={0.4}
      ListFooterComponent={
        loading ? <ActivityIndicator className="my-6" /> : null
      }
    />
  );
};

export default CameraCarousel;
