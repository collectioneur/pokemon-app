import { PokemonCardData, typeColors } from "@/types";
import { ArrowRight, Star, Trash2 } from "lucide-react-native";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

interface Props {
  pokemon: PokemonCardData | null;
  handleRemove: () => void;
  handlePressDetails: (p: PokemonCardData) => void;
}

export function FavoriteCard({
  pokemon,
  handleRemove,
  handlePressDetails,
}: Props) {
  if (!pokemon) {
    return (
      <View className="bg-white/80 rounded-xl p-3 items-center mx-4 shadow-md mb-5">
        <View className="relative flex-row gap-2 items-center">
          <Star size={16} color="#555" className="absolute top-3 right-3" />
          <Text className="text-base uppercase font-bold text-gray-500">
            Your favourite Pokémon
          </Text>
        </View>
        <Text className="text-2xl font-bold capitalize text-black mt-1">
          No Pokémon selected
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity className="flex-col gap-2 relative bg-white/80 mx-4 rounded-xl p-3 shadow-md mb-5">
      <View className="flex-row ">
        <Star size={16} color="#555" className="absolute top-3 right-3" />
        <Image
          source={{ uri: pokemon.image }}
          className="h-36 w-36 mr-3"
          resizeMode="contain"
        />
        <View className="flex-1">
          <Text className="text-base uppercase font-bold text-gray-500">
            Your favourite Pokémon
          </Text>
          <View className="mt-1">
            <Text className="text-2xl font-bold capitalize text-black">
              {pokemon.name}
            </Text>
            <View className="flex-row mt-1">
              {pokemon.types.map((t) => (
                <View
                  key={t}
                  style={{ backgroundColor: typeColors[t] }}
                  className="px-2 py-0.5 mr-1 rounded-full"
                >
                  <Text className="text-xs text-white uppercase font-semibold">
                    {t}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
      <View className="flex-row gap-2 w-full">
        <Pressable
          onPress={() => handlePressDetails(pokemon)}
          className="flex-row grow justify-center items-center bg-[##5b21b6] rounded-full gap-2 px-4 py-2"
          android_ripple={{ color: "#fff3" }}
        >
          <ArrowRight size={16} color="#fff" />
          <Text className="text-white font-semibold">Details</Text>
        </Pressable>
        <Pressable
          onPress={() => handleRemove()}
          className="flex-row grow items-center justify-center bg-[#fef08a] rounded-full px-4 py-2 gap-2"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Trash2 size={16} color="#111" className="mr-1" />
          <Text className="text-black font-semibold">Remove</Text>
        </Pressable>
      </View>
    </TouchableOpacity>
  );
}
