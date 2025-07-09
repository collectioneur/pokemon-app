import PokemonCard from "@/components/PokemonCard";
import { PokemonCardData } from "@/types";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { Search } from "lucide-react-native";
import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

interface MapsBottomSheetProps {
  createMarker: (PokemonCardData: PokemonCardData) => void;
}

export type MapsBottomSheetHandle = {
  open: () => void;
  close: () => void;
};

const GradientBackground = ({ style }: { style: any }) => (
  <LinearGradient
    colors={["#fef08a", "#5b21b6"]}
    start={{ x: 0.5, y: 0 }}
    end={{ x: 0.5, y: 1 }}
    style={[style, { flex: 1, borderRadius: 16 }]}
  />
);

const PAGE_SIZE = 6;

const MapsBottomSheet = React.forwardRef<
  MapsBottomSheetHandle,
  MapsBottomSheetProps
>(({ createMarker }, ref) => {
  const modalRef = useRef<BottomSheetModal>(null);
  const [loading, setLoading] = useState(false);
  const [pokemons, setPokemons] = useState<PokemonCardData[]>([]);
  const isFetching = useRef(false);
  const offset = useRef(0);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");

  useImperativeHandle(ref, () => ({
    open: () => {
      setQuery("");
      modalRef.current?.present();
      if (pokemons.length === 0) fetchPage();
    },
    close: () => {
      modalRef.current?.dismiss();
    },
  }));

  const snapPoints = ["40%"];

  const handleSheetChanges = useCallback((index: number) => {}, []);

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
    <BottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      enableDismissOnClose
      onChange={handleSheetChanges}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      )}
      backgroundComponent={({ style }) => <GradientBackground style={style} />}
      enableDynamicSizing={false}
    >
      <BottomSheetView
        style={{
          padding: 0,
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          marginHorizontal: 0,
          marginVertical: 0,
        }}
      >
        <Text className="text-large uppercase font-bold mt-3 text-gray-800">
          Pick a Pokémon to place on the map
        </Text>
        <View className="my-4 px-4 w-[100%] relative">
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search Pokémon…"
            placeholderTextColor="#9ca3af"
            className="bg-white/80 rounded-xl px-4 py-2 h-12 text-large font-bold shadow-md"
          />
          <View className="absolute right-7 top-1/2 -translate-y-1/2">
            <Search size={20} color="#555" />
          </View>
        </View>
        <FlatList
          data={filtered}
          horizontal={true}
          renderItem={({ item }) => (
            <View style={{ width: 160, height: 200 }}>
              <PokemonCard
                item={item}
                onPress={() => {
                  createMarker(item);
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
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default MapsBottomSheet;
