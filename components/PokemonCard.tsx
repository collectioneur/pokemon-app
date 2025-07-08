import { PokemonCardData, typeColors } from "@/types";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function PokemonCard({
  item,
  onPress,
}: {
  item: PokemonCardData;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 m-2 p-3 pt-5 bg-white/80 shadow-md rounded-2xl items-center justify-center"
    >
      <Text className="absolute top-3 left-4 text-xs text-gray-500 font-bold">
        # {item.id}
      </Text>
      <Image
        source={{ uri: item.image }}
        className="w-24 h-24"
        resizeMode="contain"
      />
      <View className="flex-row mt-1">
        {item.types.map((type) => (
          <View
            key={`${item.id}-${type}`}
            style={{ backgroundColor: typeColors[type] }}
            className="px-2 py-0.5 mr-1 rounded-full"
          >
            <Text className="text-xs text-white font-semibold uppercase">
              {type}
            </Text>
          </View>
        ))}
      </View>
      <Text className="text-base font-bold capitalize mt-1">{item.name}</Text>
    </TouchableOpacity>
  );
}
