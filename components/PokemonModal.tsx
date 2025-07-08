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

  useImperativeHandle(ref, () => ({
    open: (
      p: PokemonCardData,
      shwButton = true,
      dltButton = false,
      newPinId: string | null = null
    ) => {
      console.log(shwButton, dltButton, newPinId);
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

  // const snapPoints = ["60%"];

  const handleSheetChanges = useCallback((index: number) => {}, []);

  return (
    <BottomSheetModal
      ref={modalRef}
      // snapPoints={snapPoints}
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
              <View className="flex-row justify-between">
                <Text className="text-gray-500">HP</Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-gray-700 font-semibold">
                    {pokemon.stats.hp}
                  </Text>
                  <Heart size={16} color="#f00" />
                </View>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Attack</Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-gray-700 font-semibold">
                    {pokemon.stats.attack}
                  </Text>
                  <Sword size={16} color="#000" />
                </View>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Defense</Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-gray-700 font-semibold">
                    {pokemon.stats.defense}
                  </Text>
                  <Shield size={16} color="#000" />
                </View>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Speed</Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-gray-700 font-semibold">
                    {pokemon.stats.speed}
                  </Text>
                  <ChevronsUp size={16} color="#000" />
                </View>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Special Attack</Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-gray-700 font-semibold">
                    {pokemon.stats.specialAttack}
                  </Text>
                  <Swords size={16} color="#000" />
                </View>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Special Defense</Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-gray-700 font-semibold">
                    {pokemon.stats.specialDefense}
                  </Text>
                  <ShieldHalf size={16} color="#000" />
                </View>
              </View>
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

// import { PokemonCardData, typeColors } from "@/types";
// import {
//   ChevronsUp,
//   Heart,
//   Shield,
//   ShieldHalf,
//   Star,
//   Sword,
//   Swords,
//   X,
// } from "lucide-react-native";
// import React from "react";
// import { Image, Modal, Pressable, Text, View } from "react-native";

// interface Props {
//   visible: boolean;
//   pokemon: PokemonCardData | null;
//   onClose: () => void;
//   onFavorite: (pokemon: PokemonCardData) => void;
//   showButton?: boolean;
// }

// export default function PokemonModal({
//   visible,
//   pokemon,
//   onClose,
//   onFavorite,
//   showButton = true,
// }: Props) {
//   if (!pokemon) return null;

//   return (
//     <Modal
//       animationType="slide"
//       transparent
//       visible={visible}
//       onRequestClose={onClose}
//     >
//       <Pressable
//         className="flex-1 bg-transparent"
//         onPress={onClose}
//         android_ripple={{ color: "#0001" }}
//       />

//       <View className="absolute bottom-0 w-full rounded-t-3xl bg-white p-6 shadow-lg items-center">
//         <View className="absolute top-4 right-4">
//           <Pressable hitSlop={20} onPress={onClose}>
//             <X size={24} color="#666" />
//           </Pressable>
//         </View>

//         <Image
//           source={{ uri: pokemon.image }}
//           className="w-44 h-44 self-center mt-4 mb-2"
//           resizeMode="contain"
//         />
//         <Text className="text-3xl font-bold capitalize mb-2">
//           {pokemon.name}
//         </Text>
//         <View className="flex-row justify-center mb-4">
//           {pokemon.types.map((t) => (
//             <View
//               key={t}
//               style={{ backgroundColor: typeColors[t] }}
//               className="px-2 py-0.5 mx-1 rounded-full"
//             >
//               <Text className="text-xs uppercase text-white font-semibold">
//                 {t}
//               </Text>
//             </View>
//           ))}
//         </View>
//         <View className="w-full gap-2">
//           <View className="flex-row justify-between">
//             <Text className="text-gray-500">HP</Text>
//             <View className="flex-row items-center gap-1">
//               <Text className="text-gray-700 font-semibold">
//                 {pokemon.stats.hp}
//               </Text>
//               <Heart size={16} color="#f00" />
//             </View>
//           </View>
//           <View className="flex-row justify-between">
//             <Text className="text-gray-500">Attack</Text>
//             <View className="flex-row items-center gap-1">
//               <Text className="text-gray-700 font-semibold">
//                 {pokemon.stats.attack}
//               </Text>
//               <Sword size={16} color="#000" />
//             </View>
//           </View>
//           <View className="flex-row justify-between">
//             <Text className="text-gray-500">Defense</Text>
//             <View className="flex-row items-center gap-1">
//               <Text className="text-gray-700 font-semibold">
//                 {pokemon.stats.defense}
//               </Text>
//               <Shield size={16} color="#000" />
//             </View>
//           </View>
//           <View className="flex-row justify-between">
//             <Text className="text-gray-500">Speed</Text>
//             <View className="flex-row items-center gap-1">
//               <Text className="text-gray-700 font-semibold">
//                 {pokemon.stats.speed}
//               </Text>
//               <ChevronsUp size={16} color="#000" />
//             </View>
//           </View>
//           <View className="flex-row justify-between">
//             <Text className="text-gray-500">Special Attack</Text>
//             <View className="flex-row items-center gap-1">
//               <Text className="text-gray-700 font-semibold">
//                 {pokemon.stats.specialAttack}
//               </Text>
//               <Swords size={16} color="#000" />
//             </View>
//           </View>
//           <View className="flex-row justify-between">
//             <Text className="text-gray-500">Special Defense</Text>
//             <View className="flex-row items-center gap-1">
//               <Text className="text-gray-700 font-semibold">
//                 {pokemon.stats.specialDefense}
//               </Text>
//               <ShieldHalf size={16} color="#000" />
//             </View>
//           </View>
//         </View>

//         {showButton ? (
//           <View className="flex-row space-x-3 mt-6">
//             <Pressable
//               className="flex-row flex-1 items-center gap-2 justify-center bg-yellow-300 rounded-full py-3"
//               onPress={() => {
//                 console.log(pokemon);
//                 onFavorite(pokemon);
//                 onClose();
//               }}
//               style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
//             >
//               <Star size={18} color="#000" />
//               <Text className="text-black font-semibold">Make Favourite</Text>
//             </Pressable>
//           </View>
//         ) : null}
//       </View>
//     </Modal>
//   );
// }
