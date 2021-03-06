cmake_minimum_required(VERSION 3.17)
project(node_native)

function(PARSE_CMAKEJS_PROPERTIES)
    function(GET_VARIABLE INPUT_STRING VARIABLE_TO_SELECT OUTPUT_VARIABLE)
        set(SEARCH_STRING "${VARIABLE_TO_SELECT}=\"")
        string(LENGTH "${SEARCH_STRING}" SEARCH_STRING_LENGTH)
        string(LENGTH "${INPUT_STRING}" INPUT_STRING_LENGTH)

        string(FIND "${INPUT_STRING}" "${VARIABLE_TO_SELECT}=\"" SEARCH_STRING_INDEX)

        math(EXPR SEARCH_STRING_INDEX "${SEARCH_STRING_INDEX}+${SEARCH_STRING_LENGTH}")

        string(SUBSTRING "${INPUT_STRING}" ${SEARCH_STRING_INDEX} ${INPUT_STRING_LENGTH} AFTER_SEARCH_STRING)
        string(FIND "${AFTER_SEARCH_STRING}" "\"" QUOTE_INDEX)
        string(SUBSTRING "${AFTER_SEARCH_STRING}" "0" "${QUOTE_INDEX}" RESULT_STRING)
        set("${OUTPUT_VARIABLE}" "${RESULT_STRING}" PARENT_SCOPE)
    endfunction(GET_VARIABLE)

    string(TOLOWER "${CMAKE_BUILD_TYPE}" CMAKE_BUILD_TYPE_LOWER)
    if (CMAKE_BUILD_TYPE_LOWER STREQUAL "debug")
        exec_program(./node_modules/.bin/cmake-js ${CMAKE_CURRENT_SOURCE_DIR}
                ARGS print-configure --debug
                OUTPUT_VARIABLE CMAKE_JS_OUTPUT
                )
    else()
        exec_program(./node_modules/.bin/cmake-js ${CMAKE_CURRENT_SOURCE_DIR}
                ARGS print-configure
                OUTPUT_VARIABLE CMAKE_JS_OUTPUT
                )
    endif ()

    get_variable("${CMAKE_JS_OUTPUT}" "CMAKE_JS_INC" CMAKE_JS_INC)
    set(CMAKE_JS_INC "${CMAKE_JS_INC}" PARENT_SCOPE)

    get_variable("${CMAKE_JS_OUTPUT}" "CMAKE_LIBRARY_OUTPUT_DIRECTORY" CMAKE_LIBRARY_OUTPUT_DIRECTORY)
    set(CMAKE_LIBRARY_OUTPUT_DIRECTORY "${CMAKE_LIBRARY_OUTPUT_DIRECTORY}" PARENT_SCOPE)

endfunction(PARSE_CMAKEJS_PROPERTIES)

parse_cmakejs_properties()

set(CMAKE_CXX_STANDARD 20)
add_definitions(-DNAPI_EXPERIMENTAL)

include_directories(${CMAKE_JS_INC})
file(GLOB SOURCE_FILES "${CMAKE_SOURCE_DIR}/native.cpp")
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})
