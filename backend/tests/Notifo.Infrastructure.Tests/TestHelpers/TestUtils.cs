﻿// ==========================================================================
//  Notifo.io
// ==========================================================================
//  Copyright (c) Sebastian Stehle
//  All rights reserved. Licensed under the MIT license.
// ==========================================================================

using System.Text.Json;
using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using Notifo.Infrastructure.Collections;
using Notifo.Infrastructure.Collections.Bson;
using Notifo.Infrastructure.Collections.Json;

namespace Notifo.Infrastructure.TestHelpers
{
    public static class TestUtils
    {
        private static readonly JsonSerializerOptions DefaultOptions = new JsonSerializerOptions();

        static TestUtils()
        {
            DefaultOptions.Converters.Add(new JsonReadonlyListConverterFactory());
            DefaultOptions.Converters.Add(new JsonReadonlyDictionaryConverterFactory());

            BsonSerializer.RegisterGenericSerializerDefinition(
                typeof(ReadonlyList<>),
                typeof(ReadonlyListSerializer<>));

            BsonSerializer.RegisterGenericSerializerDefinition(
                typeof(ReadonlyDictionary<,>),
                typeof(ReadonlyDictionarySerializer<,>));
        }

        public sealed class ObjectHolder<T>
        {
            public T Value { get; set; }
        }

        public static T SerializeAndDeserialize<T>(this T value)
        {
            var obj = new ObjectHolder<T>
            {
                Value = value
            };

            var json = JsonSerializer.Serialize(obj, DefaultOptions);

            return JsonSerializer.Deserialize<ObjectHolder<T>>(json, DefaultOptions)!.Value;
        }

        public static T SerializeAndDeserializeBson<T>(this T value)
        {
            var obj = new ObjectHolder<T>
            {
                Value = value
            };

            var stream = new MemoryStream();

            using (var writer = new BsonBinaryWriter(stream))
            {
                BsonSerializer.Serialize(writer, obj);

                writer.Flush();
            }

            stream.Position = 0;

            using (var reader = new BsonBinaryReader(stream))
            {
                var result = BsonSerializer.Deserialize<ObjectHolder<T>>(reader);

                return result.Value;
            }
        }

        public static T Deserialize<T>(string value)
        {
            var json = $"{{ \"Value\": {value} }}";

            return JsonSerializer.Deserialize<ObjectHolder<T>>(json, DefaultOptions)!.Value;
        }

        public static T Deserialize<T>(object value)
        {
            var json = $"{{ \"Value\": {value} }}";

            return JsonSerializer.Deserialize<ObjectHolder<T>>(json, DefaultOptions)!.Value;
        }
    }
}
