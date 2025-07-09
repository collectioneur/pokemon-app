import { PokemonCardData, typeColors } from "@/types";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  ChevronsUp,
  Heart,
  Shield,
  ShieldHalf,
  Star,
  Sword,
  Swords,
  Trash2,
} from "lucide-react-native";
import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Image, Pressable, Text, View } from "react-native";

interface PokemonBottomSheetProps {
  onFavorite?: (pokemon: PokemonCardData) => void;
  onDelete?: (id: string) => void;
}

export type PokemonBottomSheetHandle = {
  open: (
    p: PokemonCardData,
    shwButton?: boolean,
    dltbutton?: boolean,
    pinId?: string | null
  ) => void;
  close: () => void;
};

const PokemonBottomSheet = React.forwardRef<
  PokemonBottomSheetHandle,
  PokemonBottomSheetProps
>(({ onFavorite = () => {}, onDelete = () => {} }, ref) => {
  const modalRef = useRef<BottomSheetModal>(null);
  const [pokemon, setPokemon] = useState<PokemonCardData | null>(null);
  const [showButton, setShowButton] = useState(true);
  const [deleteButton, setDeleteButton] = useState(false);
  const pinId = useRef<string | null>(null);

  const statsConfig = [
    { key: "hp", label: "HP", icon: Heart, color: "#f00" },
    { key: "attack", label: "Attack", icon: Sword, color: "#000" },
    { key: "defense", label: "Defense", icon: Shield, color: "#000" },
    { key: "speed", label: "Speed", icon: ChevronsUp, color: "#000" },
    {
      key: "specialAttack",
      label: "Special Attack",
      icon: Swords,
      color: "#000",
    },
    {
      key: "specialDefense",
      label: "Special Defense",
      icon: ShieldHalf,
      color: "#000",
    },
  ] as const;

  useImperativeHandle(ref, () => ({
    open: (
      p: PokemonCardData,
      shwButton = true,
      dltButton = false,
      newPinId: string | null = null
    ) => {
      pinId.current = newPinId;
      setShowButton(shwButton);
      setDeleteButton(dltButton);
      setPokemon(p);
      modalRef.current?.present();
    },
    close: () => {
      setPokemon(null);
      setShowButton(true);
      modalRef.current?.dismiss();
    },
  }));

  const handleSheetChanges = useCallback((index: number) => {}, []);

  return (
    <BottomSheetModal
      ref={modalRef}
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
      enableDynamicSizing={true}
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
        {pokemon && (
          <View className=" bottom-0 w-full rounded-t-3xl p-6 pb-12 items-center">
            <Image
              source={{ uri: pokemon.image }}
              className="w-44 h-44 self-center mt-4 mb-2"
              resizeMode="contain"
            />
            <Text className="text-3xl font-bold capitalize mb-2">
              {pokemon.name}
            </Text>
            <View className="flex-row justify-center mb-4">
              {pokemon?.types.map((t) => (
                <View
                  key={t}
                  style={{ backgroundColor: typeColors[t] }}
                  className="px-2 py-0.5 mx-1 rounded-full"
                >
                  <Text className="text-xs uppercase text-white font-semibold">
                    {t}
                  </Text>
                </View>
              ))}
            </View>
            <View className="w-full gap-2">
              {statsConfig.map(({ key, label, icon: Icon, color }) => (
                <View key={key} className="flex-row justify-between">
                  <Text className="text-gray-500">{label}</Text>
                  <View className="flex-row items-center gap-1">
                    <Text className="text-gray-700 font-semibold">
                      {pokemon.stats[key]}
                    </Text>
                    <Icon size={16} color={color} />
                  </View>
                </View>
              ))}
            </View>
            {showButton && (
              <View className="flex-row space-x-3 mt-6">
                <Pressable
                  className="flex-row flex-1 items-center gap-2 justify-center bg-yellow-300 rounded-full py-3"
                  onPress={() => {
                    onFavorite(pokemon);
                    modalRef.current?.dismiss();
                  }}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <Star size={18} color="#000" />
                  <Text className="text-black font-semibold">
                    Make Favourite
                  </Text>
                </Pressable>
              </View>
            )}
            {deleteButton && (
              <View className="flex-row space-x-3 mt-6">
                <Pressable
                  className="flex-row flex-1 items-center gap-2 justify-center bg-[##5b21b6] rounded-full py-3"
                  onPress={() => {
                    onDelete(pinId.current ?? "");
                    modalRef.current?.dismiss();
                  }}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <Trash2 size={18} color="#fff" />
                  <Text className="text-white font-semibold">Delete Pin</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default PokemonBottomSheet;
