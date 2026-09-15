import { MapSchema } from "@colyseus/schema";

export function generarRecursosBanca(
    recursos: MapSchema<number>
) {
    recursos.set("madera", 19);
    recursos.set("trigo", 19);
    recursos.set("lana", 19);
    recursos.set("ladrillo", 19);
    recursos.set("mineral", 19);
}