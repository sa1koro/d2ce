// javascript
// D1CE Basic components.


/* Namespace - NOBUILD */
var d1ce = d1ce || {};
/* /NOBUILD - /Namespace */


// Vector.
//              y-
//   x-  z-(Near)/z+(Far)  x+
//              y+
d1ce.Vec = class {
    //x = 0;
    //y = 0;
    //z = 0;

    // Constructor.
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Clone.
    Clone() {
        return new d1ce.Vec(this.x, this.y, this.z);
    }

    // Get vector by string.
    ToString() {
        return "" + this.x.toString() +
            "," + this.y.toString() +
            "," + this.z.toString();
    }

    // Check all number is zero.
    IsZero() {
        return this.x == 0 && this.y == 0 && this.z == 0;
    }

    // Get length square.
    LenSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    // operator+
    Add(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }

    // operator-
    Sub(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }

    // operator*
    Mul(value) {
        this.x = Math.round(this.x * value);
        this.y = Math.round(this.y * value);
        this.z = Math.round(this.z * value);
        return this;
    }

    // operator/
    Div(value) {
        if (value != 0) {
            this.x = Math.round(this.x / value);
            this.y = Math.round(this.y / value);
            this.z = Math.round(this.z / value);
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        return this;
    }

    // operator-
    Neg() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    // operator==
    Eq(other) {
        return this.x == other.x && this.y == other.y && this.z == other.z;
    }

    // operator!=
    Ne(other) {
        return this.x != other.x || this.y != other.y || this.z != other.z;
    }
}


// Vector.
d1ce.Vec.zero = new d1ce.Vec(0,0,0);
d1ce.Vec.x = new d1ce.Vec(1,0,0);
d1ce.Vec.y = new d1ce.Vec(0,1,0);
d1ce.Vec.z = new d1ce.Vec(0,0,1);


// Direction set.
//                 3(Up)
//   1(Left)  0(Near)/5(Far)  4(Right)
//                2(Down)
d1ce.Dirs = class {

    // direction set by bit flags.
    //flags = 0;

    // Constructor.
    constructor(bit = -1) {
        if (bit >= 0 && bit < d1ce.Dirs.bit_max) {
            this.flags = 1 << bit;
        } else {
            this.flags = 0;
        }
    }

    // Clone
    Clone() {
        let clone = new d1ce.Dirs();
        clone.flags = this.flags;
        return clone;
    }

    // Get directions by string.
    ToString() {
        let str1 = "";
        for (let i = 0; i < d1ce.Dirs.bit_max; ++i) {
            str1 += this.Test(new d1ce.Dirs(i)) ? i : "-";
        }
        return str1;
    }

    // Get directions by vector.
    ToVec() {
        const table = [d1ce.Vec.z.Clone().Neg(),
                       d1ce.Vec.x.Clone().Neg(),
                       d1ce.Vec.y.Clone().Neg(),
                       d1ce.Vec.y, d1ce.Vec.x, d1ce.Vec.z];
        let vec = new d1ce.Vec(0, 0, 0);
        for (let i = 0; i < d1ce.Dirs.bit_max; ++i) {
            if (this.Test(new d1ce.Dirs(i))) {
                vec.Add(table[i]);
            }
        }
        return vec;
    }

    // Clear bit flags.
    Clear() {
        this.flags = 0;
    }

    // Check all bit is down.
    IsEmpty() {
        return this.flags == 0;
    }

    // Count number of directions.
    Count() {
        count = 0;
        for (let i = 0; i < Dirs.bit_max; ++i) {
            if (this.Test(new d1ce.Dirs(i))) {
                count += 1;
            }
        }
        return count;
    }

    // Add directions.
    Add(dirs) {
        this.flags |= dirs.flags;
    }

    // Remove directions.
    Sub(dirs) {
        this.flags &= ~dirs.flags;
    }

    // Check any flag is up.
    Test(dirs) {
        return (this.flags & dirs.flags) > 0;
    }

    // Check near.
    Near() {
        return (this.flags & (1 << 0)) > 0;
    }

    // Check far.
    Far() {
        return (this.flags & (1 << 5)) > 0;
    }

    // Check right.
    Right() {
        return (this.flags & (1 << 4)) > 0;
    }

    // Check left.
    Left() {
        return (this.flags & (1 << 1)) > 0;
    }

    // Check Down.
    Down() {
        return (this.flags & (1 << 2)) > 0;
    }

    // Check up.
    Up() {
        return (this.flags & (1 << 3)) > 0;
    }
}


// Maximum of direction.
d1ce.Dirs.bit_max = 6;

// Directions.
d1ce.Dirs.empty = new d1ce.Dirs();
d1ce.Dirs.near = new d1ce.Dirs(0);
d1ce.Dirs.far = new d1ce.Dirs(5);
d1ce.Dirs.right = new d1ce.Dirs(4);
d1ce.Dirs.left = new d1ce.Dirs(1);
d1ce.Dirs.down = new d1ce.Dirs(2);
d1ce.Dirs.up = new d1ce.Dirs(3);


// 2D grid board.
//  0,0 ... W,0
//   :   x   :
//  0,H ... W,H
d1ce.Board = class {

    // // Values of each grid on the board.
    // int[,] values;
    //
    // // Objects over each grid on the board.
    // string[,] objects;

    // Constructor.
    constructor(values_) {

        // Use first length to reject jagged array.
        let width = values_ != null && values_.length > 0
                    ? values_[0].length : 0;
        let height = values_ != null ? values_.length : 0;
        //this.values = new string[height, Width];
        //this.objects = new string[height, Width];
        this.values = new Array(height);
        this.objects = new Array(height);
        for (let j = 0; j < height; ++j) {
            this.values[j] = new Array(width);
            this.objects[j] = new Array(width);
            for (let i = 0; i < width; ++i) {

                // Set 0 if no value on jagged array.
                this.values[j][i] = values_[j] ? values_[j][i] : 0;
                this.objects[j][i] = null;
            }
        }
    }

    // Clone.
    Clone() {
        let clone = new Clone();
        let width = this.Width();
        let height = this.Height();
        // clone.values = new int[height, width];
        // clone.objects = new string[height, width];
        clone.values = new Array(height);
        clone.objects = new Array(height);
        for (let j = 0; j < height; ++j) {
            clone.values[j] = new Array(width);
            clone.objects[j] = new Array(width);
            for (let i = 0; i < width; ++i) {
                clone.values[j][i] = this.values[j][i];
                clone.objects[j][i] = this.objects[j][i];
            }
        }
        return clone;
    }

    // Width of the board.
    Width() {
        return this.values != null && this.values.length > 0
               ? this.values[0].length : 0;
    }

    // Height of the board.
    Height() {
        return this.values != null ? this.values.length : 0;
    }

    // Check a point is inside the board.
    HasGrid(x, y) {
        return x >= 0 && x < this.Width() && y >= 0 && y < this.Height();
    }

    // Set a value of a grid.
    SetValue(x, y, value) {
        if (this.HasGrid(x, y)) {
            this.values[y][x] = value;
        }
    }

    // Value of a grid.
    Value(x, y) {
        return this.HasGrid(x, y) ? this.values[y][x] : d1ce.Board.invalid_value;
    }

    // Remove all objects.
    RemoveObjects() {
        let width = this.Width();
        let height = this.Height();
        for (let j = 0; j < height; ++j) {
            for (let i = 0; i < width; ++i) {
                this.objects[j][i] = null;
            }
        }
    }

    // Add an object.
    AddObject(obj, x, y) {
        if (this.HasGrid(x, y)) {
            this.objects[y][x] = obj;
        }
    }

    // Get the board and objects by string.
    ToString() {
        let width = this.Width();
        let height = this.Height();

        // Print each grids.
        let str1 = "";
        for (let j = 0; j < height; ++j) {
            for (let i = 0; i < width; ++i) {
                if (this.objects[j][i] != null) {
                    str1 += " " + this.objects[j][i];
                } else {
                    str1 += " " + this.Value(i, j);
                }
            }
            str1 += "\n";
        }

        return str1;
    }
}


// Invalid value.
d1ce.Board.invalid_value = -1;


// Piece.
d1ce.Piece = class {
    // Vec pos;
    // Dirs dirs;
    // Movement movement;

    // Constructor.
    constructor(pos, movement=null) {
        this.pos = pos;
        this.dirs = new d1ce.Dirs();
        this.movement = movement;
    }

    // Clone
    Clone() {
        let clone = new d1ce.Piece();
        clone.pos = this.pos.Clone();
        clone.dirs = this.dirs.Clone();
        clone.movement = this.movement;
        return clone;
    }
}


/* Basic components test - NOBUILD */
d1ce.BasicsTest = class {

    // Main.
    static Main() {
        document.write("<pre>\n");

        let vec = new d1ce.Vec();
        let dirs = new d1ce.Dirs();
        document.write("Vec=" + vec.ToString() +
                       " Dirs=" + dirs.ToString() + "\n");

        for (let i = 0; i < d1ce.Dirs.bit_max; i++) {
            let d = new d1ce.Dirs(i);
            document.write("Plus " + d.ToString() + "\n");
            vec.Add(d.ToVec());
            dirs.Add(d);
            document.write("Vec=" + vec.ToString() +
                           " Dirs=" + dirs.ToString() + "\n");
        }

        for (let i = 0; i < d1ce.Dirs.bit_max; ++i) {
            let d = new d1ce.Dirs(i);
            document.write("Minus " + d.ToString() + "\n");
            vec.Sub(d.ToVec());
            dirs.Sub(d);
            document.write("Vec=" + vec.ToString() +
                           " Dirs=" + dirs.ToString() + "\n");
        }

        let board_values = new Array(5);
        for (let j = 0; j < 5; ++j) {
            board_values[j] = new Array(5);
        }
        let board = new d1ce.Board(board_values);
        for (let j = 0; j < 5; ++j) {
            for (let i = 0; i < 5; ++i) {
                board.SetValue(i, j, i + j);
            }
        }

        let piece = new d1ce.Piece(new d1ce.Vec(1, 1));
        let clone_piece = piece;

        board.RemoveObjects();
        board.AddObject("A", clone_piece.pos.x, clone_piece.pos.y);
        document.write(board.ToString() + "\n");

        let clone_board = board;
        document.write(clone_board.ToString() + "\n");

        document.write("</pre>\n");
    }
}

window.onload = () => d1ce.BasicsTest.Main()
/* /NOBUILD - /Test */
