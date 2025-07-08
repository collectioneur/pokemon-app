import { FavoriteCard } from "@/components/favoriteCard";
import PC from "@/components/PokemonCard";
import PokemonBottomSheet, {
  PokemonBottomSheetHandle,
} from "@/components/PokemonModal";
import { PokemonCardData } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Search } from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ActivityIndicator, FlatList, TextInput, View } from "react-native";

const PAGE_SIZE = 24;

export default function Index() {
  const bottomSheetRef = useRef<PokemonBottomSheetHandle>(null);
  const [query, setQuery] = useState("");
  const [pokemons, setPokemons] = useState<PokemonCardData[]>([]);
  const offset = useRef(0);
  const isFetching = useRef(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<PokemonCardData | null>(null);
  const [favoritePokemon, setFavoritePokemon] =
    useState<PokemonCardData | null>(null);
  const PokemonCard = React.memo(PC);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem("@favoritePokemon");
      if (raw) setFavoritePokemon(JSON.parse(raw));
    })();
  }, []);

  const handlePressCard = (p: PokemonCardData) => {
    const showButton = p.id !== favoritePokemon?.id;
    console.log(favoritePokemon?.id, p.id);
    console.log("Show button:", showButton);
    bottomSheetRef.current?.open(p, showButton);
  };

  const onPressRef = useCallback(
    (p: PokemonCardData) => () => handlePressCard(p),
    [handlePressCard]
  );

  const saveFavorite = async (pokemon: PokemonCardData) => {
    setFavoritePokemon(pokemon);
    try {
      await AsyncStorage.setItem("@favoritePokemon", JSON.stringify(pokemon));
      console.log("Favorite Pokémon saved:", pokemon);
    } catch (error) {
      console.error("Failed to save favorite Pokémon", error);
    }
  };

  const removeFavorite = async () => {
    setFavoritePokemon(null);
    try {
      await AsyncStorage.removeItem("@favoritePokemon");
      console.log("Favorite Pokémon removed");
    } catch (error) {
      console.error("Failed to remove favorite Pokémon", error);
    }
  };

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

  const filtered = useMemo(
    () =>
      query.trim()
        ? pokemons.filter((p) =>
            p.name.toLowerCase().includes(query.toLowerCase())
          )
        : pokemons,
    [pokemons, query]
  );

  return (
    <LinearGradient
      colors={["#fef08a", "#5b21b6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1, paddingTop: 80 }}
    >
      <FavoriteCard
        pokemon={favoritePokemon}
        handleRemove={removeFavorite}
        handlePressDetails={handlePressCard}
      />
      <View className="mx-4 mb-3 relative">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search Pokémon…"
          placeholderTextColor="#9ca3af"
          className="bg-white/80 rounded-xl px-4 py-2 h-16 text-xl font-bold shadow-md"
        />
        <View className="absolute right-5 top-1/2 -translate-y-1/2">
          <Search size={20} color="#555" />
        </View>
      </View>
      <FlatList
        data={filtered}
        initialNumToRender={24}
        maxToRenderPerBatch={8}
        renderItem={({ item }) => (
          <PokemonCard item={item} onPress={onPressRef(item)} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 24 }}
        onEndReached={fetchPage}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loading ? <ActivityIndicator className="my-6" /> : null
        }
      />
      <PokemonBottomSheet onFavorite={saveFavorite} ref={bottomSheetRef} />
    </LinearGradient>
  );
}
